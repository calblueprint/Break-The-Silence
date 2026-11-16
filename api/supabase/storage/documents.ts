import {
  createDocumentStorageFilename,
  getDocumentNameParts,
  MAX_DOCUMENT_FILE_SIZE_BYTES,
  validateDocumentName,
} from '../../../src/utils/documentFiles';
import { getDocumentUploadError } from '../../../src/utils/documentUploadErrors';
import supabase from '../client';

function logNameError(error: unknown) {
  const { code, status } = getDocumentUploadError(error);
  console.warn('Document name could not be saved or loaded', { code, status });
}

async function readUploadedDocumentName(fullPath: string) {
  try {
    // list() omits custom upload metadata; info() returns it in metadata.
    const { data, error } = await supabase.storage
      .from('documents_poc')
      .info(fullPath);
    if (error) throw error;
    const encodedName: unknown = data.metadata?.originalNameEncoded;
    const originalName: unknown =
      typeof encodedName === 'string'
        ? decodeURIComponent(encodedName)
        : data.metadata?.originalName;
    return typeof originalName === 'string'
      ? validateDocumentName(originalName)
      : undefined;
  } catch (error) {
    // A failed metadata read must not hide the file or stop other names loading.
    logNameError(error);
    return undefined;
  }
}

async function saveDocumentName(
  ownerId: string,
  objectId: string,
  fullPath: string,
  name: string,
) {
  const { data, error } = await supabase
    .from('document_names')
    .upsert(
      {
        object_id: objectId,
        owner_id: ownerId,
        file_path: fullPath,
        display_name: validateDocumentName(name),
      },
      { onConflict: 'file_path' },
    )
    .select('display_name')
    .single();
  if (error) throw error;
  return data.display_name as string;
}

export async function renameDocument(
  fullPath: string,
  objectId: string,
  newName: string,
) {
  const name = validateDocumentName(newName);
  const storedName = fullPath.split('/').pop() ?? '';
  if (
    getDocumentNameParts(name).extension !==
    getDocumentNameParts(storedName).extension
  ) {
    throw new Error('Keep the original file extension.');
  }
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('Sign in again to rename this document.');
  }
  if (!objectId || !fullPath.startsWith(`${user.id}/`)) {
    throw new Error('Only the owner can rename this document.');
  }
  try {
    return await saveDocumentName(user.id, objectId, fullPath, name);
  } catch (error) {
    logNameError(error);
    throw new Error('Could not save the new name. Please try again.');
  }
}

export async function uploadFileToSupabase(
  uri: string,
  fileName: string,
  mimeType: string,
) {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (!user) {
      throw Object.assign(new Error('Not authenticated'), {
        code: 'AccessDenied',
        status: 401,
      });
    }

    const response = await fetch(uri);
    if (!response.ok) throw new Error('Could not read the selected file.');
    const arrayBuffer = await response.arrayBuffer();
    if (arrayBuffer.byteLength > MAX_DOCUMENT_FILE_SIZE_BYTES) {
      throw Object.assign(new Error('File exceeds the 10 MB upload limit.'), {
        code: 'EntityTooLarge',
        status: 413,
      });
    }

    const uniquePath = `${user.id}/${createDocumentStorageFilename(fileName)}`;
    const { data, error } = await supabase.storage
      .from('documents_poc')
      .upload(uniquePath, arrayBuffer, {
        contentType: mimeType,
        upsert: false,
        // The SDK base64-encodes metadata with btoa in browsers/Expo, which
        // cannot encode all Unicode. Keep the metadata payload ASCII-safe.
        metadata: {
          originalNameEncoded: encodeURIComponent(
            fileName.replace(/^SENSITIVE_/, ''),
          ),
        },
      });

    if (error) throw error;
    // Name persistence must not turn a successful upload into a failed upload
    // if an environment has not applied the document_names migration yet.
    try {
      await saveDocumentName(
        user.id,
        data.id,
        data.path,
        fileName.replace(/^SENSITIVE_/, ''),
      );
    } catch (nameError) {
      logNameError(nameError);
    }
    return data;
  } catch (error) {
    const { category, code, status, message } = getDocumentUploadError(error);
    console.warn('Document upload failed', { category, code, status, message });
    throw error;
  }
}

export async function fetchUploadedFiles() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: ownFiles, error: ownError } = await supabase.storage
    .from('documents_poc')
    .list(user.id);

  if (ownError) throw ownError;

  const myFiles = ownFiles.map(file => ({
    ...file,
    fullPath: `${user.id}/${file.name}`,
    isShared: false,
  }));

  const { data: sharedRecords, error: sharedError } = await supabase
    .from('document_shares')
    .select('id, file_path')
    .eq('shared_with_id', user.id)
    .neq('owner_id', user.id);

  if (sharedError) throw sharedError;

  const sharedFiles = sharedRecords.map(record => {
    const fileName = record.file_path.split('/').pop() || 'Shared File';

    const ext = fileName.split('.').pop()?.toLowerCase();
    let mime = 'unknown';
    if (ext === 'jpg' || ext === 'jpeg') mime = 'image/jpeg';
    else if (ext === 'png') mime = 'image/png';
    else if (ext === 'gif') mime = 'image/gif';

    return {
      id: record.id,
      name: fileName,
      fullPath: record.file_path,
      isShared: true,
      metadata: { mimetype: mime },
    };
  });

  const files = [...myFiles, ...sharedFiles];
  if (files.length === 0) return files;
  const { data: names, error: namesError } = await supabase
    .from('document_names')
    .select('file_path, display_name')
    .in(
      'file_path',
      files.map(file => file.fullPath),
    );
  if (namesError) {
    logNameError(namesError);
  }
  const displayNames = new Map(
    (names ?? []).map(record => [
      record.file_path,
      record.display_name as string,
    ]),
  );
  const namedFiles = files.map(file => ({
    ...file,
    displayName: displayNames.get(file.fullPath),
  }));
  // A name chosen before upload is already stored with the file and does not
  // depend on the optional document_names table. Limit concurrent info calls.
  for (let start = 0; start < namedFiles.length; start += 5) {
    await Promise.all(
      namedFiles.slice(start, start + 5).map(async file => {
        if (file.displayName || !file.id) return;
        file.displayName = await readUploadedDocumentName(file.fullPath);
      }),
    );
  }
  return namedFiles;
}

export async function getSecureFileUrl(fullPath: string) {
  const { data, error } = await supabase.storage
    .from('documents_poc')
    .createSignedUrl(fullPath, 60);

  if (error) throw error;
  return data.signedUrl;
}

export async function deleteFileFromSupabase(fullPath: string) {
  const { error } = await supabase.storage
    .from('documents_poc')
    .remove([fullPath]);

  if (error) throw error;
}

export async function shareFileWithUser(
  fullPath: string,
  recipientUserId: string,
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase.from('document_shares').insert({
    owner_id: user.id,
    shared_with_id: recipientUserId,
    file_path: fullPath,
  });

  if (error) throw error;
}

export async function removeSharedFile(shareId: string) {
  const { error } = await supabase
    .from('document_shares')
    .delete()
    .eq('id', shareId);

  if (error) throw error;
}

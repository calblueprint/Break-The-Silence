import supabase from '../client';

export async function uploadFileToSupabase(
  uri: string,
  fileName: string,
  mimeType: string,
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const response = await fetch(uri);
  const arrayBuffer = await response.arrayBuffer();

  const uniquePath = `${user.id}/${Date.now()}_${fileName}`;

  const { data, error } = await supabase.storage
    .from('documents_poc')
    .upload(uniquePath, arrayBuffer, { contentType: mimeType });

  if (error) throw error;
  return data;
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

  return [...myFiles, ...sharedFiles];
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

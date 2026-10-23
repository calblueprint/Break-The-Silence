import { supabase } from '../auth';

const BUCKET_NAME = 'documents_poc';

export async function uploadFileToSupabase(
  uri: string,
  fileName: string,
  mimeType: string,
) {
  try {
    const response = await fetch(uri);
    const arrayBuffer = await response.arrayBuffer();

    const uniqueFileName = `${Date.now()}_${fileName}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(uniqueFileName, arrayBuffer, {
        contentType: mimeType,
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Supabase upload error:', error);
    throw error;
  }
}

export async function fetchUploadedFiles() {
  const { data, error } = await supabase.storage.from(BUCKET_NAME).list();
  if (error) throw error;
  return data.filter(file => file.name !== '.emptyFolderPlaceholder');
}

export function getFilePublicUrl(fileName: string) {
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
  return data.publicUrl;
}

export async function deleteFileFromSupabase(fileName: string) {
  const { error } = await supabase.storage.from(BUCKET_NAME).remove([fileName]);
  if (error) throw error;
}

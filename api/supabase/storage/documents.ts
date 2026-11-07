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

  const { data, error } = await supabase.storage
    .from('documents_poc')
    .list(user.id);

  if (error) throw error;

  return data.map(file => ({
    ...file,
    fullPath: `${user.id}/${file.name}`,
  }));
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

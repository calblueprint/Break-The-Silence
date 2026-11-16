DROP POLICY IF EXISTS "Allow POC operations" ON storage.objects;

CREATE POLICY "Allow users to manage their own folders" 
ON storage.objects FOR ALL 
USING (
  bucket_id = 'documents_poc' AND (auth.uid())::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'documents_poc' AND (auth.uid())::text = (storage.foldername(name))[1]
);
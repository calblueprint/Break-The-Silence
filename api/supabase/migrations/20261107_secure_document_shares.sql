CREATE TABLE public.document_shares (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id uuid REFERENCES auth.users(id) NOT NULL,
    shared_with_id uuid REFERENCES auth.users(id) NOT NULL,
    file_path text NOT NULL,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.document_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can manage their shares"
ON public.document_shares FOR ALL
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can view shares granted to them"
ON public.document_shares FOR SELECT
USING (auth.uid() = shared_with_id);

DROP POLICY IF EXISTS "Allow users to manage their own folders" ON storage.objects;

CREATE POLICY "Owners can manage their own files"
ON storage.objects FOR ALL
USING (bucket_id = 'documents_poc' AND (auth.uid())::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'documents_poc' AND (auth.uid())::text = (storage.foldername(name))[1]);

CREATE POLICY "Shared users can view files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents_poc' AND
  EXISTS (
    SELECT 1 FROM public.document_shares
    WHERE shared_with_id = auth.uid() AND file_path = name
  )
);

GRANT ALL ON public.document_shares TO authenticated;

CREATE POLICY "Receivers can remove shares granted to them"
ON public.document_shares FOR DELETE
USING (auth.uid() = shared_with_id);
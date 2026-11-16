-- Keep the POC bucket private, including in environments provisioned manually.
insert into storage.buckets (id, name, public)
values ('documents_poc', 'documents_poc', false)
on conflict (id) do update set public = false;

-- Permissive policies are ORed. The old FOR ALL owner policy allowed inserts
-- that bypassed the separate INSERT policy's owner-folder check.
drop policy if exists "Owners can manage their shares" on public.document_shares;
drop policy if exists "Users can create shares" on public.document_shares;
drop policy if exists "Users can create shares for their own files" on public.document_shares;

create policy "Owners can manage their shares"
on public.document_shares for all
to authenticated
using (auth.uid() = owner_id)
with check (
  auth.uid() = owner_id
  and file_path like (auth.uid()::text || '/%')
);

alter policy "Users can view shares granted to them"
on public.document_shares to authenticated;

alter policy "Receivers can remove shares granted to them"
on public.document_shares to authenticated;

-- Do not grant TRUNCATE: RLS does not protect that operation.
revoke all on public.document_shares from anon, authenticated;
grant select, insert, update, delete on public.document_shares to authenticated;

alter policy "Owners can manage their own files"
on storage.objects to authenticated;

drop policy if exists "Shared users can view files" on storage.objects;
create policy "Shared users can view files"
on storage.objects for select
to authenticated
using (
  bucket_id = 'documents_poc'
  and exists (
    select 1 from public.document_shares
    where shared_with_id = auth.uid()
      and file_path = name
      -- Reject legacy shares whose claimed owner does not own the file folder.
      and owner_id::text = (storage.foldername(name))[1]
  )
);

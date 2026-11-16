-- Display names have their own owner-protected record so renaming never moves
-- a Storage object or changes existing document_shares paths.
create table public.document_names (
  file_path text primary key,
  object_id uuid not null unique references storage.objects(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null check (
    char_length(display_name) between 1 and 180
    and display_name = btrim(display_name)
    and display_name !~ '[/\\:[:cntrl:]]'
    and display_name !~ '^\.+$'
  )
);

alter table public.document_names enable row level security;
revoke all on public.document_names from anon, authenticated;
grant select, insert, update, delete on public.document_names to authenticated;

create policy "Owners can manage document names"
on public.document_names for all to authenticated
using (owner_id = auth.uid())
with check (
  owner_id = auth.uid()
  and (storage.foldername(file_path))[1] = auth.uid()::text
  and exists (
    select 1 from storage.objects as object
    where object.id = object_id
      and object.bucket_id = 'documents_poc'
      and object.name = file_path
  )
);

create policy "Recipients can read shared document names"
on public.document_names for select to authenticated
using (
  owner_id::text = (storage.foldername(file_path))[1]
  and exists (
    select 1 from public.document_shares as share
    where share.file_path = document_names.file_path
      and share.owner_id = document_names.owner_id
      and share.shared_with_id = auth.uid()
  )
);

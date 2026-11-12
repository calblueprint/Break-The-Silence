-- Row Level Security for the Diary table.
-- Each signed-in user can only read, create, edit, and delete their own entries.
-- The app never sends user_id; it is filled in from the session on insert.

alter table public."Diary" alter column user_id set default auth.uid();

alter table public."Diary" enable row level security;

drop policy if exists "Users can read own diary entries" on public."Diary";
create policy "Users can read own diary entries"
  on public."Diary" for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can create own diary entries" on public."Diary";
create policy "Users can create own diary entries"
  on public."Diary" for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update own diary entries" on public."Diary";
create policy "Users can update own diary entries"
  on public."Diary" for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete own diary entries" on public."Diary";
create policy "Users can delete own diary entries"
  on public."Diary" for delete
  to authenticated
  using ((select auth.uid()) = user_id);

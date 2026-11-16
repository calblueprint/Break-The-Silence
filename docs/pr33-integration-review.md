# PR #33 integration review

Branch: `justin/documents-poc-clean` (initial HEAD `7398b7d`). Integrated fetched `origin/main` at `a32caf8ccaf17607d4898461fb468f86c7a78bae` using `git merge --no-commit --no-ff origin/main`. The merge is intentionally uncommitted. No push, PR mutation, or change to `main` was made.

## Changes

- Resolved the tab-layout conflict by combining Keyo's floating dock and Profile navigation with main's working `/tools` navigator. Removed the Toolkit placeholder screen and alert. The dock shows only Support, Journal, Home, Toolkit, and Profile, accounts for Expo Router's `home/index` route, and remains hidden on Guides completion. It reserves layout space so Diary controls remain reachable.
- Kept Lucas's Home redesign; updated its Documents shortcut and Home search result to `/profile/documents`.
- Kept Keyo's Profile styling; reconnected Log out to the existing `signOut()` helper, with duplicate-tap prevention and error handling. RootLayout's existing auth subscription redirects signed-out sessions to `/auth/login`.
- Kept main's Safe Exit control and optional `onExit` callback. Guides' external website/phone confirmation component is unchanged. Viewer and upload modals each have their own Safe Exit; exit closes modal state and clears selected files and the current signed URL before navigating. Late picker, signed-URL, upload, deletion, and sharing completions cannot reopen modal content or show an alert after exit.
- Kept multi-file upload, listing, image viewing, sensitivity blur, and the existing sharing POC. Recognized the sensitivity marker after the upload timestamp. Connected removal of a received share to the existing `removeSharedFile()` helper, preserving the owner's file. Stopped file-options taps from also opening the viewer.
- Moved the two Documents migrations to the project's existing `supabase/migrations` directory with standard timestamps. Kept the Diary migration unchanged. Added a separate Documents hardening migration; no remote migration was applied.
- Declared the Expo-compatible `babel-preset-expo` dev dependency already referenced by `babel.config.js`. A clean Metro rebuild exposed its absence; cached builds had used older installed Expo modules. Updated the existing lockfile without unrelated package upgrades.

## Supabase migration review

No alternate migration-directory configuration or Supabase CLI configuration is checked in. `supabase/migrations` already contains the Diary migration and is the [standard Supabase migration directory](https://supabase.com/docs/guides/deployment/database-migrations).

| Previous path                                                    | New path                                                           |
| ---------------------------------------------------------------- | ------------------------------------------------------------------ |
| `api/supabase/migrations/20261028_user_scoped_documents_rls.sql` | `supabase/migrations/20261028000000_user_scoped_documents_rls.sql` |
| `api/supabase/migrations/20261107_secure_document_shares.sql`    | `supabase/migrations/20261107000000_secure_document_shares.sql`    |

The relocated SQL is unchanged. `20261115000000_documents_integration_hardening.sql` makes `documents_poc` private and restricts sharing writes to the owner's folder. The original owner `FOR ALL` policy could bypass the stricter INSERT policy because [permissive policies combine with OR](https://www.postgresql.org/docs/current/sql-createpolicy.html). The new migration also rejects legacy share records whose claimed owner does not match the file folder, limits policy roles to authenticated users, and removes the original `GRANT ALL` privilege that included TRUNCATE.

Before applying migrations to an existing environment, inspect its migration history and schema. If either old script was applied manually, reconcile its existing table/policies and old version identifiers with the new filenames first. Do not blindly replay `CREATE TABLE document_shares` against an existing table or mark the hardening migration applied without executing it. The repository's migrations assume the existing application schema, including `Diary`; they are not a complete blank-project schema bootstrap.

The read-only bucket metadata request returned HTTP 400 with the available application credentials. This does **not** establish whether the deployed bucket exists or is private. No admin database session, Supabase CLI, or device session was available for live verification.

An administrator should open **Storage → documents_poc → Configuration** and confirm Public is disabled. Verify in the SQL Editor:

```sql
select id, name, public
from storage.buckets
where id = 'documents_poc';
-- Exactly one row, with public = false.

select schemaname, tablename, policyname, roles, cmd, qual, with_check
from pg_policies
where (schemaname = 'storage' and tablename = 'objects')
   or (schemaname = 'public' and tablename = 'document_shares');
-- Review every policy, including policies created outside these migrations.
-- No broad POC policy may grant unrelated users access to documents_poc.

select
  has_table_privilege('anon', 'public.document_shares', 'select') as anon_read,
  has_table_privilege('authenticated', 'public.document_shares', 'truncate') as user_truncate;
-- Both false after hardening.
```

A [public bucket bypasses read access controls](https://supabase.com/docs/guides/storage/buckets/fundamentals), so folder policies alone are insufficient. Check both the bucket setting and policies.

## POC limitations retained

- Sharing still accepts an exact Supabase user UUID. There is no trusted-contact relationship check or recipient confirmation. The policy scopes shares to the owner's path; it does not check that the object currently exists. Deleting an object does not clean up its share rows. Reusing the same path could therefore restore access under a stale share.
- Shared recipients can read a file and remove their received share, but cannot delete the owner's stored object. Previously issued signed URLs can remain usable until their 60-second expiry after a share is removed.
- The recipient prompt uses React Native's iOS-only `Alert.prompt`. No Android/web sharing flow was added.
- Image viewing is implemented; other file types retain the POC placeholder viewer. Folder counts, Profile counts, Move, Rename, and some other design controls remain POC placeholders.
- Sensitivity blur is a view preference encoded in the filename, not an additional authorization boundary.
- Safe Exit retains the existing navigation behavior and does not sign out. It dismisses app-owned modals and prevents follow-up UI work. An upload already sent to Storage may finish; exit prevents subsequent files in the batch from starting. It does not delete device picker caches or implement OS app-switcher protection.

## Validation

- Full ESLint, Prettier, and TypeScript checks pass.
- Expo production web export passes.
- All four migrations execute in timestamp order in an isolated PostgreSQL runtime with Supabase-shaped auth/storage schemas. Ten checks cover bucket privacy, owner/recipient/third-user/anonymous access, forged INSERT and UPDATE shares, legacy forged shares, share removal, TRUNCATE denial, and unchanged Diary RLS. These are local database tests, not a deployment check.
- All 62 browser assertions pass: 27 full-app checks, 29 Guides confirmation checks, and six narrow-screen/sharing/logout-error checks. These use isolated fixture auth, picker results, and storage responses. They do not upload, delete, or share real documents. Device and live Supabase checks below remain required.

## Manual device and live Supabase checklist

- [ ] Review/reconcile migration history, apply the Documents migrations through the team's normal workflow, and run the bucket/policy/privilege checks above. Leave the existing Diary migration intact.
- [ ] Sign in as user A. Confirm exactly five dock tabs, their order, active highlights, and usable controls on a small/notched iOS and Android screen.
- [ ] Open Toolkit → Guides and Resources. Check guide search, bookmarking, category navigation, resource lists, and returning to Toolkit. Guides completion must hide the dock and keep Safe Exit available.
- [ ] From Home, use My Documents and the Documents search result. Both must open Profile's Documents screen without adding a tab.
- [ ] Create, edit, save, discard, search, filter, and delete Diary entries. Confirm unsaved-change back prompts still work and floating buttons are not covered by the dock.
- [ ] Press Safe Exit from all five tabs, a dirty Diary form, a guide, a resource category, Documents, the viewer, and the upload modal. Confirm the existing landing/auth route appears and no private modal remains.
- [ ] In Guides, open both website and phone confirmations. Verify Cancel and Continue retain their behavior; Safe Exit must dismiss the confirmation without opening the external resource.
- [ ] Select multiple document types and upload. Verify owner-folder paths, list refresh, size/type metadata, 10 MB handling, partial failures, and deletion of an owned file in both UI and Storage.
- [ ] Upload an image with Blur these photos enabled. Open it and verify blur, reveal, hide, and reset to blurred on reopening. Verify a non-sensitive image remains unblurred.
- [ ] During a slow file pick, signed-URL request, and multi-file upload, press Safe Exit. After the pending work finishes, verify no modal reopens, no completion alert appears, and no later file in the upload batch starts. An already-transmitted upload may complete.
- [ ] Verify Android Back dismisses the document viewer and upload sheet without leaving private content behind. Test native picker and page-sheet dismissal on a device.
- [ ] On iOS, share an owned image with user B using the existing UUID prompt. B can list/view it; B removing it must leave A's stored file intact. User C and signed-out clients must not list, sign, download, update, or delete A's files.
- [ ] With a non-production test object, verify a user cannot insert or update a share to another owner's path, including through direct API calls, and anonymous/public URLs cannot retrieve the object. Verify removal stops new signed URLs and existing URLs expire.
- [ ] Press Log out on Profile. Confirm `/auth/login`, no protected content on Back, and correct behavior after relaunch. Simulate sign-out failure and confirm a retry is possible.

Ready for final code review after local checks; device and deployed Supabase verification require Project Lead sign-off before merging/releasing. The Git merge is deliberately left uncommitted for that review.

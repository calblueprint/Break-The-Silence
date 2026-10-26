import type { JournalEntry, NewJournalEntry } from '@/types/journal';
import supabase from '../client';

// Row shape of the Diary table (only the columns the app reads)
interface DiaryRow {
  id: string;
  title: string | null;
  description: string | null;
  created_at: string;
}

const DIARY_COLUMNS = 'id, title, description, created_at';

function toJournalEntry(row: DiaryRow): JournalEntry {
  return {
    id: row.id,
    title: row.title ?? '',
    content: row.description ?? '',
    createdAt: row.created_at,
  };
}

// Blank titles are stored as null since title is optional
function toDiaryColumns(entry: Partial<NewJournalEntry>) {
  return {
    ...(entry.title !== undefined && { title: entry.title.trim() || null }),
    ...(entry.content !== undefined && { description: entry.content }),
  };
}

// RLS limits every query below to the signed-in user's own rows, and user_id
// defaults to auth.uid() on insert, so the app never sends a user ID.

// Current user's entries, newest first
export async function fetchDiaryEntries(): Promise<JournalEntry[]> {
  const { data, error } = await supabase
    .from('Diary')
    .select(DIARY_COLUMNS)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Error fetching diary entries: ${error.message}`);
  }

  return data.map(toJournalEntry);
}

// Returns null if the entry does not exist or belongs to another user
export async function fetchDiaryEntry(
  id: string,
): Promise<JournalEntry | null> {
  const { data, error } = await supabase
    .from('Diary')
    .select(DIARY_COLUMNS)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(`Error fetching diary entry: ${error.message}`);
  }

  return data ? toJournalEntry(data) : null;
}

export async function createDiaryEntry(
  entry: NewJournalEntry,
): Promise<JournalEntry> {
  const { data, error } = await supabase
    .from('Diary')
    .insert(toDiaryColumns(entry))
    .select(DIARY_COLUMNS)
    .single();

  if (error) {
    throw new Error(`Error creating diary entry: ${error.message}`);
  }

  return toJournalEntry(data);
}

export async function updateDiaryEntry(
  id: string,
  updates: Partial<NewJournalEntry>,
): Promise<JournalEntry> {
  const { data, error } = await supabase
    .from('Diary')
    .update({
      ...toDiaryColumns(updates),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select(DIARY_COLUMNS)
    .single();

  if (error) {
    throw new Error(`Error updating diary entry: ${error.message}`);
  }

  return toJournalEntry(data);
}

export async function deleteDiaryEntry(id: string): Promise<void> {
  const { error } = await supabase.from('Diary').delete().eq('id', id);

  if (error) {
    throw new Error(`Error deleting diary entry: ${error.message}`);
  }
}

export interface JournalEntry {
  id: string;
  // Empty string when the entry has no title
  title: string;
  content: string;
  // ISO 8601 string from the Diary table's created_at (timestamptz)
  createdAt: string;
}

export type NewJournalEntry = Pick<JournalEntry, 'title' | 'content'>;

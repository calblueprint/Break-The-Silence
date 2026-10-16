export type JournalTag = 'incident' | 'support';

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  tag: JournalTag | null;
  // ISO 8601 string so it maps directly onto a Supabase timestamptz column
  createdAt: string;
}

export type NewJournalEntry = Pick<JournalEntry, 'title' | 'content' | 'tag'>;

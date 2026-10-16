import type { JournalEntry } from '@/types/journal';

// Temporary seed data until journal entries are loaded from Supabase.
const mockJournalEntries: JournalEntry[] = [
  {
    id: 'mock-1',
    title: 'A harder day',
    content: 'Today felt heavy from the moment I woke up.',
    tag: 'incident',
    createdAt: '2026-10-09T09:41:00',
  },
  {
    id: 'mock-2',
    title: 'Talked to my sister',
    content:
      'Called my sister after dinner and told her a little more than usual. She listened and did not push. It felt good to say some of it out loud.',
    tag: 'support',
    createdAt: '2026-09-28T20:15:00',
  },
  {
    id: 'mock-3',
    title: '',
    content:
      'Went for a long walk by the water this morning. Did not think about much, just breathed. Want to do this more often.',
    tag: null,
    createdAt: '2026-09-21T07:30:00',
  },
  {
    id: 'mock-4',
    title: 'Noting this down',
    content:
      'He showed up at my workplace again without telling me. I asked him to leave and he did after about ten minutes. A coworker saw it happen.',
    tag: 'incident',
    createdAt: '2026-09-14T13:05:00',
  },
];

export default mockJournalEntries;

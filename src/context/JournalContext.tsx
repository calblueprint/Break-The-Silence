import type { JournalEntry, NewJournalEntry } from '@/types/journal';
import type { ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import mockJournalEntries from '@/data/mockJournalEntries';

interface JournalContextValue {
  // Sorted newest first
  entries: JournalEntry[];
  addEntry: (entry: NewJournalEntry) => JournalEntry;
  getEntry: (id: string) => JournalEntry | undefined;
}

interface JournalProviderProps {
  children: ReactNode;
}

const JournalContext = createContext<JournalContextValue | null>(null);

// Holds journal entries in local state for now. When Supabase is connected,
// swap the initial state for a fetch and have addEntry insert a row; screens
// only depend on this interface so they should not need to change.
export function JournalProvider({ children }: JournalProviderProps) {
  const [entries, setEntries] = useState<JournalEntry[]>(() =>
    sortNewestFirst(mockJournalEntries),
  );

  const addEntry = useCallback((entry: NewJournalEntry) => {
    const created: JournalEntry = {
      ...entry,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setEntries(prev => sortNewestFirst([created, ...prev]));
    return created;
  }, []);

  const getEntry = useCallback(
    (id: string) => entries.find(entry => entry.id === id),
    [entries],
  );

  const value = useMemo(
    () => ({ entries, addEntry, getEntry }),
    [entries, addEntry, getEntry],
  );

  return (
    <JournalContext.Provider value={value}>{children}</JournalContext.Provider>
  );
}

export function useJournal() {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
}

function sortNewestFirst(entries: JournalEntry[]) {
  return [...entries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

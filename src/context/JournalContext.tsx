import type { JournalEntry, NewJournalEntry } from '@/types/journal';
import type { ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import Toast from '@/components/journal/Toast';
import {
  createDiaryEntry,
  deleteDiaryEntry,
  fetchDiaryEntries,
  updateDiaryEntry,
} from '~/api/supabase/queries/diary';

const TOAST_DURATION_MS = 3000;

interface JournalContextValue {
  // Sorted newest first
  entries: JournalEntry[];
  loading: boolean;
  // Set when loading entries fails; cleared by a successful refresh
  error: string | null;
  refresh: () => Promise<void>;
  // These throw if the Supabase request fails so screens can show an error
  addEntry: (entry: NewJournalEntry) => Promise<JournalEntry>;
  updateEntry: (
    id: string,
    updates: Partial<NewJournalEntry>,
  ) => Promise<JournalEntry>;
  deleteEntry: (id: string) => Promise<void>;
  getEntry: (id: string) => JournalEntry | undefined;
  // Shows a short message that stays visible across journal screens
  showToast: (message: string) => void;
}

interface JournalProviderProps {
  children: ReactNode;
}

const JournalContext = createContext<JournalContextValue | null>(null);

// Loads the signed-in user's Diary entries from Supabase and keeps them in
// state so screens can read them synchronously after the first load.
export function JournalProvider({ children }: JournalProviderProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const loadEntries = useCallback(async () => {
    try {
      setEntries(await fetchDiaryEntries());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load entries.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const refresh = useCallback(async () => {
    setLoading(true);
    await loadEntries();
  }, [loadEntries]);

  const addEntry = useCallback(async (entry: NewJournalEntry) => {
    const created = await createDiaryEntry(entry);
    setEntries(prev => sortNewestFirst([created, ...prev]));
    return created;
  }, []);

  const updateEntry = useCallback(
    async (id: string, updates: Partial<NewJournalEntry>) => {
      const updated = await updateDiaryEntry(id, updates);
      setEntries(prev =>
        prev.map(entry => (entry.id === id ? updated : entry)),
      );
      return updated;
    },
    [],
  );

  const deleteEntry = useCallback(async (id: string) => {
    await deleteDiaryEntry(id);
    setEntries(prev => prev.filter(entry => entry.id !== id));
  }, []);

  const getEntry = useCallback(
    (id: string) => entries.find(entry => entry.id === id),
    [entries],
  );

  const value = useMemo(
    () => ({
      entries,
      loading,
      error,
      refresh,
      addEntry,
      updateEntry,
      deleteEntry,
      getEntry,
      showToast: setToastMessage,
    }),
    [
      entries,
      loading,
      error,
      refresh,
      addEntry,
      updateEntry,
      deleteEntry,
      getEntry,
    ],
  );

  return (
    <JournalContext.Provider value={value}>
      {children}
      {toastMessage ? <Toast message={toastMessage} /> : null}
    </JournalContext.Provider>
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

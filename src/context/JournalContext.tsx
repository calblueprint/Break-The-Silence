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
// Longer when there's a button like Undo, so there's time to tap it
const TOAST_WITH_ACTION_DURATION_MS = 5000;

export interface ToastOptions {
  icon?: 'check' | 'trash';
  // Text button on the right, like "Undo"
  actionText?: string;
  onAction?: () => void;
}

interface ToastState extends ToastOptions {
  message: string;
}

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
  // Re-creates deleted entries with their original dates (they get new ids).
  // Throws if any fail; the ones that worked stay restored.
  restoreEntries: (deleted: JournalEntry[]) => Promise<void>;
  getEntry: (id: string) => JournalEntry | undefined;
  // Shows a short message that stays visible across journal screens
  showToast: (message: string, options?: ToastOptions) => void;
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
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(
      () => setToast(null),
      toast.actionText ? TOAST_WITH_ACTION_DURATION_MS : TOAST_DURATION_MS,
    );
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = useCallback(
    (message: string, options?: ToastOptions) =>
      setToast({ message, ...options }),
    [],
  );

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
      // Re-sorts in case the entry's date changed
      setEntries(prev =>
        sortNewestFirst(prev.map(entry => (entry.id === id ? updated : entry))),
      );
      return updated;
    },
    [],
  );

  const deleteEntry = useCallback(async (id: string) => {
    await deleteDiaryEntry(id);
    setEntries(prev => prev.filter(entry => entry.id !== id));
  }, []);

  const restoreEntries = useCallback(async (deleted: JournalEntry[]) => {
    const results = await Promise.allSettled(
      deleted.map(entry =>
        createDiaryEntry({
          title: entry.title,
          content: entry.content,
          createdAt: entry.createdAt,
        }),
      ),
    );
    const restored = results.flatMap(result =>
      result.status === 'fulfilled' ? [result.value] : [],
    );
    setEntries(prev => sortNewestFirst([...restored, ...prev]));
    if (restored.length < deleted.length) {
      throw new Error('Could not restore some entries.');
    }
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
      restoreEntries,
      getEntry,
      showToast,
    }),
    [
      entries,
      loading,
      error,
      refresh,
      addEntry,
      updateEntry,
      deleteEntry,
      restoreEntries,
      getEntry,
      showToast,
    ],
  );

  return (
    <JournalContext.Provider value={value}>
      {children}
      {toast ? (
        <Toast
          {...toast}
          // With no entries left there's no floating button to sit above
          raised={entries.length > 0}
          onAction={
            toast.onAction
              ? () => {
                  setToast(null);
                  toast.onAction?.();
                }
              : undefined
          }
        />
      ) : null}
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

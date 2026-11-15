import type { ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { guideCatalogEntries } from '@/data/guideCatalogData';
import supabase from '~/api/supabase/client';

interface GuideBookmarksContextValue {
  isBookmarked: (id: string) => boolean;
  toggleBookmark: (id: string) => void;
  loading: boolean;
  error: string | null;
}

const GuideBookmarksContext = createContext<GuideBookmarksContextValue | null>(
  null,
);
const defaultBookmarks = guideCatalogEntries
  .filter(guide => guide.isBookmarked)
  .map(guide => guide.id);

// Finish earlier saves before reading or writing again, including after a
// provider unmount. This keeps rapid toggles and return visits in order.
let storageQueue: Promise<void> = Promise.resolve();

export function GuideBookmarksProvider({ children }: { children: ReactNode }) {
  const [storageKey, setStorageKey] = useState<string | null>(null);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [needsSave, setNeedsSave] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ready = storageKey !== null && loadedKey === storageKey;

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setStorageKey(session ? `guide-bookmarks:v1:${session.user.id}` : null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let active = true;
    setLoadedKey(null);
    setNeedsSave(false);
    setError(null);
    setBookmarkedIds(new Set());
    if (!storageKey) return;

    void storageQueue
      .then(() => AsyncStorage.getItem(storageKey))
      .then(saved => {
        const ids: unknown =
          saved === null ? defaultBookmarks : JSON.parse(saved);
        if (!Array.isArray(ids) || !ids.every(id => typeof id === 'string')) {
          throw new Error('Invalid saved guide bookmarks');
        }
        if (active) {
          setBookmarkedIds(new Set(ids));
          setLoadedKey(storageKey);
        }
      })
      .catch(() => {
        if (active)
          setError(
            'Could not load bookmarks. Please reopen Guides to try again.',
          );
      });

    return () => {
      active = false;
    };
  }, [storageKey]);

  useEffect(() => {
    if (!ready || !needsSave) return;
    let active = true;
    const saved = JSON.stringify([...bookmarkedIds]);
    storageQueue = storageQueue
      .then(() => AsyncStorage.setItem(storageKey, saved))
      .then(() => {
        if (active) setError(null);
      })
      .catch(() => {
        if (active)
          setError(
            'Could not save bookmarks on this device. Please try again.',
          );
      });
    return () => {
      active = false;
    };
  }, [bookmarkedIds, needsSave, ready, storageKey]);

  const isBookmarked = useCallback(
    (id: string) => ready && bookmarkedIds.has(id),
    [bookmarkedIds, ready],
  );
  const toggleBookmark = useCallback(
    (id: string) => {
      if (!ready) return;
      setBookmarkedIds(previous => {
        const next = new Set(previous);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
      setNeedsSave(true);
    },
    [ready],
  );
  const value = useMemo(
    () => ({ isBookmarked, toggleBookmark, loading: !ready, error }),
    [isBookmarked, toggleBookmark, ready, error],
  );

  return (
    <GuideBookmarksContext.Provider value={value}>
      {children}
    </GuideBookmarksContext.Provider>
  );
}

export function useGuideBookmarks() {
  const context = useContext(GuideBookmarksContext);
  if (!context) {
    throw new Error(
      'useGuideBookmarks must be used within a GuideBookmarksProvider',
    );
  }
  return context;
}

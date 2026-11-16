import type { ResourceWithDetails } from '~/api/supabase/queries/resources';
import type { ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useFocusEffect } from 'expo-router';
import useIsMountedRef from '@/hooks/useIsMountedRef';
import { getResourceCategories } from '@/utils/resourceCatalog';
import { getResources } from '~/api/supabase/queries/resources';

interface ResourcesContextValue {
  resources: ResourceWithDetails[];
  categories: ReturnType<typeof getResourceCategories>;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const ResourcesContext = createContext<ResourcesContextValue | null>(null);

export function ResourcesProvider({ children }: { children: ReactNode }) {
  const [resources, setResources] = useState<ResourceWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);
  const isMounted = useIsMountedRef();

  const refresh = useCallback(async () => {
    const currentRequest = ++requestId.current;
    setRefreshing(true);
    setError(null);
    try {
      const next = await getResources();
      if (isMounted.current && currentRequest === requestId.current) {
        setResources(next);
      }
    } catch {
      if (isMounted.current && currentRequest === requestId.current) {
        setError('We couldn’t load resources. Please try again.');
      }
    } finally {
      if (isMounted.current && currentRequest === requestId.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [isMounted]);

  // Refresh on entering Resources; share the same catalog with category pages.
  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const categories = useMemo(
    () => getResourceCategories(resources),
    [resources],
  );
  const value = useMemo(
    () => ({ resources, categories, loading, refreshing, error, refresh }),
    [resources, categories, loading, refreshing, error, refresh],
  );

  return (
    <ResourcesContext.Provider value={value}>
      {children}
    </ResourcesContext.Provider>
  );
}

export function useResources() {
  const context = useContext(ResourcesContext);
  if (!context) {
    throw new Error('useResources must be used within a ResourcesProvider');
  }
  return context;
}

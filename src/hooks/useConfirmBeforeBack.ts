import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigation, usePreventRemove } from 'expo-router';

// iOS swipe back sends POP and the Android back button sends GO_BACK
const BACK_ACTIONS = ['GO_BACK', 'POP', 'POP_TO_TOP'];

// Asks for confirmation before going back. Only back actions are stopped, not
// everything that removes the screen like usePreventRemove does, so Safe Exit
// and logging out can never be blocked by unsaved changes.
// Returns a function to call right before leaving on purpose.
export default function useConfirmBeforeBack(
  enabled: boolean,
  onBackAttempt: () => void,
) {
  const [leaving, setLeaving] = useState(false);
  const rootNavigation = useNavigation('/');
  const pendingNavigation = useRef<(() => void) | null>(null);
  const disablePrevention = usePreventRemove(
    enabled && !leaving,
    ({ data }) => {
      if (BACK_ACTIONS.includes(data.action.type)) {
        onBackAttempt();
      } else {
        // Safe Exit and auth redirects must continue without a discard prompt.
        pendingNavigation.current = () => rootNavigation.dispatch(data.action);
        setLeaving(true);
      }
    },
  );

  // Let removal prevention update before replaying a root-level replacement.
  useEffect(() => {
    if (!leaving || !pendingNavigation.current) return;
    const resume = pendingNavigation.current;
    pendingNavigation.current = null;
    resume();
  }, [leaving]);

  return useCallback(() => {
    setLeaving(true);
    disablePrevention();
  }, [disablePrevention]);
}

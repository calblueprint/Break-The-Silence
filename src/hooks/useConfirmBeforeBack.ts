import { useCallback, useEffect, useId, useRef } from 'react';
import { useNavigation } from 'expo-router';
import {
  usePreventRemoveContext,
  useRoute,
} from 'expo-router/react-navigation';

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
  const navigation = useNavigation();
  const { key: routeKey } = useRoute();
  const { setPreventRemove } = usePreventRemoveContext();
  const id = useId();
  const allowed = useRef(false);

  // Makes the native stack hand iOS swipes to the listener below
  useEffect(() => {
    setPreventRemove(id, routeKey, enabled);
    return () => setPreventRemove(id, routeKey, false);
  }, [setPreventRemove, id, routeKey, enabled]);

  useEffect(() => {
    if (!enabled) return;
    return navigation.addListener('beforeRemove', event => {
      if (allowed.current || !BACK_ACTIONS.includes(event.data.action.type)) {
        return;
      }
      event.preventDefault();
      onBackAttempt();
    });
  }, [navigation, enabled, onBackAttempt]);

  return useCallback(() => {
    allowed.current = true;
  }, []);
}

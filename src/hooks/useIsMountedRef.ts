import { useEffect, useRef } from 'react';

// Lets async work check that its screen is still open before navigating or
// showing an alert, such as after Safe Exit during a save
export default function useIsMountedRef() {
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return isMounted;
}

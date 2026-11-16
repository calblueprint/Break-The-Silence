import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

// Whether the on-screen keyboard is open. iOS fires "will" events so the UI
// can change as the keyboard animates; Android only has "did" events.
export default function useKeyboardVisible() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showListener = Keyboard.addListener(showEvent, () =>
      setVisible(true),
    );
    const hideListener = Keyboard.addListener(hideEvent, () =>
      setVisible(false),
    );
    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  return visible;
}

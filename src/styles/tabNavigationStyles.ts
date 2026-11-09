import { StyleSheet } from 'react-native';
import colors from '@/styles/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    // Shows around the dock, so it has to match the screens above it
    backgroundColor: colors.white,
  },
  // Floating pill dock. It still takes up layout space, so screen content and
  // floating buttons always stop above it.
  tabBar: {
    alignSelf: 'center',
    width: 300,
    maxWidth: '90%',
    height: 60,
    paddingBottom: 0,
    borderTopWidth: 0,
    borderRadius: 30,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
  tabBarItem: {
    flex: 1,
    justifyContent: 'center',
  },
  tabBarIcon: {
    width: 48,
    height: 48,
  },
  tabIcon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
  },
  tabIconFocused: {
    backgroundColor: colors.primaryLight,
  },
  icon: {
    width: 24,
    height: 24,
  },
  houseIcon: {
    width: 24,
    height: 21,
  },
  // Floats over every tab screen, matching the design's top-right X
  safeExitButton: {
    position: 'absolute',
    right: 16,
  },
});

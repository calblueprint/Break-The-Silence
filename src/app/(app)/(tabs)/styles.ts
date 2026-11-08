import type { ColorValue } from 'react-native';
import { StyleSheet } from 'react-native';
import colors from '@/styles/colors';

export const getTabBarIconColor = (
  color: ColorValue | undefined,
): Exclude<ColorValue, number | null> =>
  typeof color === 'number'
    ? colors.tabBarActive
    : (color ?? colors.tabBarActive);

export default StyleSheet.create({
  plusButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.tabBarActive,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.tabBarActive,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 7,
  },

  tabBarStyle: {
    height: 85,
    paddingBottom: 0,
  },
  tabBarItemStyle: {
    flex: 1,
  },
  tabBarIconStyle: {
    width: 50,
    height: 50,
  },
  tabBarLabelStyle: {
    fontSize: 11,
    marginTop: -4,
  },
});

import type { ComponentProps } from 'react';
import { Alert, Image, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tabs } from 'expo-router';
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import SafeExitButton from '@/components/SafeExitButton';
import colors from '@/styles/colors';
import styles from '@/styles/tabNavigationStyles';
import HouseIcon from '~/assets/House.png';
import JournalIcon from '~/assets/journal.png';
import ToolkitIcon from '~/assets/toolkit.png';

type TabBarProps = Parameters<
  NonNullable<ComponentProps<typeof Tabs>['tabBar']>
>[0];

function FloatingTabBar({ state, descriptors, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={[bar.wrapper, { bottom: Math.max(insets.bottom, 16) }]}
    >
      <View style={bar.pill}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;
          const color = focused ? colors.primary : colors.navInactive;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              accessibilityLabel={
                options.tabBarAccessibilityLabel ?? options.title
              }
              onPress={onPress}
              style={bar.item}
            >
              <View style={[bar.bubble, focused && bar.bubbleActive]}>
                {options.tabBarIcon?.({ focused, color, size: 24 })}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const bar = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  pill: {
    width: 300,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    backgroundColor: '#F8FAFC',
    shadowColor: '#200940',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  item: {
    flex: 1,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubbleActive: {
    backgroundColor: '#F1E8F7',
  },
});

export default function TabsLayout() {
  return (
    <View style={styles.container}>
      <Tabs
        tabBar={props => <FloatingTabBar {...props} />}
        screenOptions={{ tabBarShowLabel: false }}
      >
        <Tabs.Screen
          name="support"
          options={{
            title: 'Support',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <SimpleLineIcons name="earphones-alt" size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="journal"
          options={{
            title: 'Journal',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Image
                source={JournalIcon}
                style={[styles.icon, { tintColor: color }]}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Image
                source={HouseIcon}
                style={[styles.houseIcon, { tintColor: color }]}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="toolkit"
          listeners={{
            tabPress: e => {
              e.preventDefault();
              Alert.alert(
                'Toolkit',
                'Toolkit features are coming in a future sprint!',
              );
            },
          }}
          options={{
            title: 'Toolkit',
            tabBarIcon: ({ color }) => (
              <Image
                source={ToolkitIcon}
                style={[styles.icon, { tintColor: color }]}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Ionicons name="person-outline" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
      <SafeExitButton
        style={{
          position: 'absolute',
          top: 76,
          right: 20,
          zIndex: 999,
        }}
      />
    </View>
  );
}

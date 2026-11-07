import type { ReactNode } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tabs } from 'expo-router';
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import SafeExitButton from '@/components/SafeExitButton';
import colors from '@/styles/colors';
import HouseIcon from '~/assets/House.png';
import JournalIcon from '~/assets/journal.png';
import ToolkitIcon from '~/assets/toolkit.png';

// Puts a soft circle behind the icon of the open tab
function TabIcon({
  focused,
  children,
}: {
  focused: boolean;
  children: ReactNode;
}) {
  return (
    <View style={[styles.tabIcon, focused && styles.tabIconFocused]}>
      {children}
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: [
            styles.tabBar,
            { marginBottom: Math.max(insets.bottom, 16) },
          ],
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.navInactive,
          tabBarItemStyle: styles.tabBarItem,
          tabBarIconStyle: styles.tabBarIcon,
        }}
      >
        <Tabs.Screen
          name="support"
          options={{
            title: 'Support',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon focused={focused}>
                <SimpleLineIcons name="earphones-alt" size={22} color={color} />
              </TabIcon>
            ),
          }}
        />
        <Tabs.Screen
          name="journal"
          options={{
            title: 'Journal',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon focused={focused}>
                <Image
                  source={JournalIcon}
                  style={[styles.icon, { tintColor: color }]}
                />
              </TabIcon>
            ),
          }}
        />
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon focused={focused}>
                <Image
                  source={HouseIcon}
                  style={[styles.houseIcon, { tintColor: color }]}
                />
              </TabIcon>
            ),
          }}
        />
        <Tabs.Screen
          name="documents"
          options={{
            title: 'Toolkit',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon focused={focused}>
                <Image
                  source={ToolkitIcon}
                  style={[styles.icon, { tintColor: color }]}
                />
              </TabIcon>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon focused={focused}>
                <Ionicons name="person-outline" size={24} color={color} />
              </TabIcon>
            ),
          }}
        />
        <Tabs.Screen
          name="documents/upload"
          options={{
            href: null,
          }}
        />
      </Tabs>
      <SafeExitButton
        style={[styles.safeExitButton, { top: insets.top + 4 }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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

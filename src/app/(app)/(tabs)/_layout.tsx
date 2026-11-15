import type { ReactNode } from 'react';
import { Image, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tabs, useSegments } from 'expo-router';
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import SafeExitButton from '@/components/SafeExitButton';
import colors from '@/styles/colors';
import styles from '@/styles/tabNavigationStyles';
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
  const segments = useSegments();
  const isGuideCompletion = segments[segments.length - 1] === 'completed';

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: [
            styles.tabBar,
            { marginBottom: Math.max(insets.bottom, 16) },
            isGuideCompletion && { display: 'none' },
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
          name="tools"
          options={{
            title: 'Toolkit',
            headerShown: false,
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
          name="documents"
          options={{
            href: null,
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

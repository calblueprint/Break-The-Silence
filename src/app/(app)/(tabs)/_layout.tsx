import { StyleSheet, View } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  //MaterialCommunityIcons,
  SimpleLineIcons,
} from '@expo/vector-icons';
import styles from '@/components/Button/styles';

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

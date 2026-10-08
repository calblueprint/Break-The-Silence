import { Tabs, useRouter } from 'expo-router';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function TabsLayout() {
  const router = useRouter();
  return (
    <Tabs>
      <Tabs.Screen
        name="support"
        options={{
          title: 'Support',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="question-circle" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Journal',
          tabBarIcon: ({ color }) => (
            <Ionicons name="journal-outline" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="safe-exit"
        options={{
          title: 'Safe Exit',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="exit-to-app"
              size={28}
              color={color}
            />
          ),
        }}
        listeners={{
          tabPress: event => {
            event.preventDefault();
            router.replace('/');
          },
        }}
      />
      <Tabs.Screen
        name="documents"
        options={{
          title: 'Documents',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="user-circle" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <Ionicons name="document-text-outline" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="documents/upload"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="journal/new_entry"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

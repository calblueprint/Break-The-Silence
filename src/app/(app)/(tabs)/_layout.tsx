import { Image, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tabs } from 'expo-router';
import {
  Ionicons,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from '@expo/vector-icons';
import SafeExitButton from '@/components/SafeExitButton';
import HouseIcon from '~/assets/House.png';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            height: 85,
            // paddingBottom: 10,
            paddingBottom: 0,
          },
          tabBarActiveTintColor: '#3524C4',
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
        }}
      >
        <Tabs.Screen
          name="support"
          options={{
            title: 'Support',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <SimpleLineIcons name="earphones-alt" size={29} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="journal"
          options={{
            title: 'Journal',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Ionicons name="journal-outline" size={31} color={color} />
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
          name="documents"
          options={{
            title: 'Toolkit',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="toolbox-outline"
                size={35}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => (
              <Ionicons name="person-outline" size={29} color={color} />
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
  },
  houseIcon: {
    width: 31,
    height: 27,
  },
  // Floats over every tab screen, matching the design's top-right X
  safeExitButton: {
    position: 'absolute',
    right: 16,
  },
});

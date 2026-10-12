import { StyleSheet, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { Tabs, useRouter } from 'expo-router';

export default function TabsLayout() {
  const router = useRouter();
  return (
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
          tabBarIcon: ({ color }) => (
            <Ionicons name="journal-outline" size={31} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="safe-exit"
        options={{
          tabBarLabelStyle: {
            opacity: 0,
          },
          tabBarIconStyle: {
            width: 70,
            height: 70,
          },
          title: 'Safe Exit',
          tabBarIcon: () => (
            <View style={styles.plusButton}>
              <Feather name="x" color="white" size={50} />
            </View>
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
          title: 'Toolkit',
          tabBarIcon: ({ color }) => (
            <Icon name="toolbox-outline" size={35} color={color} />
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
      <Tabs.Screen
        name="journal/new_entry"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  plusButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#3524C4',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3524C4',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 7,
  },
});

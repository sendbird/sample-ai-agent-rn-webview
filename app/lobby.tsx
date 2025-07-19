import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useUser } from '@/libs/user';
import { router } from 'expo-router';
import NotificationsTab from '@/libs/notifications/NotificationsTab';
import MessagesTab from '@/libs/messages/MessagesTab';

const Tab = createMaterialTopTabNavigator();

function LobbyHeader() {
  const { user, logout } = useUser();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.welcomeText}>Welcome back!</Text>
        <Text style={styles.userText}>{user?.nickname || user?.userId}</Text>
      </View>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function LobbyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <LobbyHeader />
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabLabel,
          tabBarIndicatorStyle: styles.tabIndicator,
          tabBarActiveTintColor: '#742DDD',
          tabBarInactiveTintColor: '#666',
        }}
      >
        <Tab.Screen
          name="Notifications"
          component={NotificationsTab}
          options={{ title: 'Notifications' }}
        />
        <Tab.Screen
          name="Messages"
          component={MessagesTab}
          options={{ title: 'AI Messages' }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
  },
  userText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  logoutText: {
    color: '#666',
    fontWeight: '500',
  },
  tabBar: {
    backgroundColor: 'white',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabLabel: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'none',
  },
  tabIndicator: {
    backgroundColor: '#742DDD',
    height: 3,
  },
});

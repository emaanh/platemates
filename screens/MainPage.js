import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from 'react-native-vector-icons/Feather'; // Updated import
import { TouchableOpacity } from 'react-native';
import HomeScreen from './MainTabs/HomeScreen';
import ProfileScreen from './MainTabs/ProfileScreen';
import NotificationsScreen from './MainTabs/NotificationsScreen';

const Tab = createBottomTabNavigator();

function MainPage() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false, // Remove the header
        tabBarIcon: ({ focused }) => {
          let iconName;
          const color = focused ? '#E83F10' : 'white';

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Profile':
              iconName = 'user';
              break;
            case 'Notifications':
              iconName = 'bell';
              break;
            default:
              iconName = 'circle';
          }

          return <Feather name={iconName} size={30} color={color} />;
        },
        tabBarStyle: {
          backgroundColor: '#000000', // Set tab bar background to black
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: '#E83F10',
        tabBarInactiveTintColor: '#AAAAAA',
        tabBarShowLabel: false, // Hide labels
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1, // Ensure the screen takes up the full space
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000', // Set screen background to black
  },
  screenText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'transparent',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'left',
    borderWidth: 1,
    borderColor: 'white', // Default color, can be dynamically changed
    width: '90%',
    alignSelf: 'center',
  }
});

export default MainPage;


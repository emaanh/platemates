import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from 'react-native-vector-icons/Feather'; // Updated import

const Tab = createBottomTabNavigator();

function HomeScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenText}>Home Screen</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenText}>Profile Screen</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenText}>Settings Screen</Text>
    </View>
  );
}

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
            case 'Settings':
              iconName = 'settings';
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
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Styles for Screens
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
});

export default MainPage;
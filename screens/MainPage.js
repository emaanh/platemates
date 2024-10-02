import React, {useContext, useState} from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from 'react-native-vector-icons/Feather'; // Updated import
import { TouchableOpacity } from 'react-native';
import HomeScreen from './MainTabs/HomeScreen';
import EventHomeScreen from './MainTabs/EventHomeScreen';
import ProfileScreen from './MainTabs/ProfileScreen';
import NotificationsScreen from './MainTabs/NotificationsScreen';
import { colors } from '../stylevars';
import { AuthContext } from '../AuthProvider';

const Tab = createBottomTabNavigator();

function MainPage() {
  const { user, userData } = useContext(AuthContext);
  const [isUserInEvent, setIsUserInEvent] = useState(false);
  if(user === null){
    return;
  }

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false, // Remove the header
        tabBarIcon: ({ focused }) => {
          let iconName;
          const icon_color = focused ? colors.primary : colors.white;

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

          return <Feather name={iconName} size={30} color={icon_color} />;
        },
        tabBarStyle: {
          backgroundColor: colors.black, // Set tab bar background to black
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.grey,
        tabBarShowLabel: false, // Hide labels
      })}
    >
      <Tab.Screen name="Home">
        {(props) =>
          isUserInEvent ? (
            <EventHomeScreen {...props} setUserInEvent={setIsUserInEvent} />
          ) : (
            <HomeScreen {...props} setUserInEvent={setIsUserInEvent} />
          )
        }
      </Tab.Screen>
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
    backgroundColor: colors.black, // Set screen background to black
  },
  screenText: {
    color: colors.white,
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
    borderColor: colors.white, // Default color, can be dynamically changed
    width: '90%',
    alignSelf: 'center',
  }
});

export default MainPage;


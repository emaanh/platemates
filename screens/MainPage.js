import React, {useEffect, useContext, useState} from 'react';
import { ActivityIndicator, Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from 'react-native-vector-icons/Feather'; // Updated import
import { TouchableOpacity } from 'react-native';
import HomeScreen from './MainTabs/HomeScreen';
import EventHub from './MainTabs/EventHomeScreen';
import ProfileScreen from './MainTabs/ProfileScreen';
import NotificationsScreen from './MainTabs/NotificationsScreen';
import { colors } from '../stylevars';
import { AuthContext } from '../AuthProvider';

const Tab = createBottomTabNavigator();

import { useNavigation } from '@react-navigation/native';

function MainPage() {
  const navigation = useNavigation();
  const { user, userData, subscribed, clearUser} = useContext(AuthContext);
  const [isUserInEvent, setIsUserInEvent] = useState(userData ? userData.inEvent : false);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    if (userData) {
      setIsUserInEvent(userData.inEvent);
      setLoading(false);
    }
  }, [userData]);

  if(loading){
    return (
      <View style={{flex: 1,justifyContent: 'center',alignItems: 'center',backgroundColor: colors.background,}}>
        <ActivityIndicator size="large" color="black" />
        <Text style={{fontFamily: 'Poppins_400Regular', fontSize: 20, color: colors.black, marginTop: 10}}>{"Contact: 650-282-0663 if Stuck."}</Text>
        <TouchableOpacity onPress={() => {
          clearUser();
          navigation.navigate('LandingScreen')
        }} style={{marginTop: 10, paddingVertical: 8, paddingHorizontal: 16, backgroundColor: '#000', borderRadius: 5}}>
          <Text style={{color: '#fff', fontSize: 16}}>Return to Home Page</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if(user === null){
    navigation.navigate('LandingScreen');
    return (
      <View style={{flex: 1,justifyContent: 'center',alignItems: 'center',backgroundColor: colors.background,}}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }


  const toggleUserInEvent = (bool) => {
    setIsUserInEvent(bool);
  }


  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false, // Remove the header
        tabBarIcon: ({ focused }) => {
          let iconName;
          const icon_color = focused ? colors.primary : colors.black;

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

          return(
            <View style={{width: 70, marginLeft: 35}}>
              <Feather name={iconName} size={35} color={icon_color} />
            </View>
          ) ;
        },
        tabBarStyle: {
          backgroundColor: colors.background, // Set tab bar background to black
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
            <EventHub {...props} toggleUserInEvent={toggleUserInEvent} />
          ) : (
            <HomeScreen {...props} toggleUserInEvent={toggleUserInEvent} />
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
    backgroundColor: colors.background, // Set screen background to black
  },
  screenText: {
    color: colors.black,
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
    borderColor: colors.black, // Default color, can be dynamically changed
    width: '90%',
    alignSelf: 'center',
  }
});

export default MainPage;
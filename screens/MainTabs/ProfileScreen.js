import React, { useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { createStackNavigator } from '@react-navigation/stack';
import EditProfile from './ProfileScreens/EditProfile';
import Help from './ProfileScreens/Help';
import Bookings from './ProfileScreens/Bookings';
import Settings from './ProfileScreens/Settings';
import { colors } from '../../stylevars';


const Stack = createStackNavigator();

function ProfileScreen() {

  return (
    <Stack.Navigator screenOptions={{ swipeEnabled: false, headerShown: false  }}>
      <Stack.Screen
        name="ProfileMain"
        component={ProfilePage}
      />
      <Stack.Screen
        name="Bookings"
        component={Bookings}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
      />
      <Stack.Screen
        name="Help"
        component={Help}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
      />
    </Stack.Navigator>
  );
}

function ProfilePage({navigation}) {
  const handleFindBookings = () => {
    navigation.navigate('Bookings');
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  const handleLogout = () => {
    navigation.navigate('Help');
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  return (
    <View style={styles.screenContainer}>
      {/* Profile Picture */}
      <Image
        source={{ uri: 'https://via.placeholder.com/150' }} // Replace with actual profile picture URL or local asset
        style={styles.profileImage}
      />

      {/* Profile Name */}
      <Text style={styles.profileName}>John Doe</Text>
      <TouchableOpacity style={{marginTop: -15,padding: 10, backgroundColor: colors.light_grey, borderRadius: 5}} onPress={handleEditProfile}>
        <Text style={{fontFamily: 'Poppins_400Regular', color: 'black', fontSize: 18}}>Edit Profile</Text>
      </TouchableOpacity>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleFindBookings}>
          <Feather name="book" size={20} color={colors.white} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Find My Latest Bookings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSettings}>
          <Feather name="settings" size={20} color={colors.white} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button]} onPress={handleLogout}>
          <Feather name="user" size={20} color={colors.white} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Help Center</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: 'center',
    paddingTop: 50, // Adjust as needed
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60, // Makes the image circular
    borderWidth: 2,
    borderColor: colors.white,
    marginBottom: 20,
    marginTop: 100
  },
  profileName: {
    color: colors.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    fontFamily: 'Poppins_700Bold'
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    top: 150,
    flexDirection: 'row', // Align icon and text horizontally
    backgroundColor: 'transparent',
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center', // Vertically center the content
    borderWidth: 1,
    borderColor: colors.white,
    width: '90%',
  },
  buttonIcon: {
    marginRight: 10, // Space between icon and text
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
  },
  logoutButton: {
    borderColor: colors.red, // Red color for logout
  },
});

export default ProfileScreen;
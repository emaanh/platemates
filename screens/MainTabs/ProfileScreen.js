import React, { useContext,useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { createStackNavigator } from '@react-navigation/stack';
import EditProfile from './ProfileScreens/EditProfile';
import Help from './ProfileScreens/Help';
import Bookings from './ProfileScreens/Bookings';
import Settings from './ProfileScreens/Settings';
import { colors } from '../../stylevars';
import Icon from 'react-native-vector-icons/FontAwesome';
import EditPersonalityQuestion from './ProfileScreens/EditPersonalityQuestion';
import EditField from './ProfileScreens/EditField';
import { AuthContext } from '../../AuthProvider';
import EULAScreen from './ProfileScreens/EULAScreen';
import TermsAndConditionsScreen from './ProfileScreens/TermsAndConditionsScreen';

import { onSnapshot, doc, updateDoc, getDoc, setDoc, deleteDoc, getDocs, collection, serverTimestamp, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase-config';



const Stack = createStackNavigator();

function ProfileScreen() {
  const { userData, user } = useContext(AuthContext);

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
      <Stack.Screen
        name="EditPersonalityQuestion"
        component={EditPersonalityQuestion}
      />
      <Stack.Screen
        name="EditField"
        component={EditField}
      />
      <Stack.Screen
        name="TermsAndConditions"
        component={TermsAndConditionsScreen}
      />
      <Stack.Screen
        name="EULA"
        component={EULAScreen}
      />
    </Stack.Navigator>
  );
}

function ProfilePage({navigation}) {
  const { userData } = useContext(AuthContext);

  const handleFindBookings = () => {
    navigation.navigate('Bookings');
  };

  const handleSettings = async() => {
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
      <View style={styles.profileIconContainer}>
        <Icon name="user-circle" size={150} color={colors.dark_tan} />
      </View>


      {/* Profile Name */}
      <Text style={styles.profileName}>{userData.fullName}</Text>
      <TouchableOpacity style={{marginTop: -15,paddingVertical: 7.5, paddingHorizontal: 10, backgroundColor: 'transparent', borderRadius: 5, borderWidth: 1, borderColor: colors.black}} onPress={handleEditProfile}>
        <Text style={{fontFamily: 'Poppins_400Regular', color: 'black', fontSize: 18}}>Edit Profile</Text>
      </TouchableOpacity>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleFindBookings}>
          <Feather name="book" size={20} color={colors.black} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Find My Past Bookings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSettings}>
          <Feather name="settings" size={20} color={colors.black} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button]} onPress={handleLogout}>
          <Feather name="user" size={20} color={colors.black} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Help Center</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingTop: 0, // Adjust as needed
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIconContainer: {
    width: 150,
    height: 150,
    borderRadius: 75, // Makes the container a circle
    backgroundColor: colors.background, // Background color for the circle
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 15
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60, // Makes the image circular
    borderWidth: 2,
    borderColor: colors.black,
    marginBottom: 20,
    marginTop: 100
  },
  profileName: {
    color: colors.black,
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
    top: 90,
    flexDirection: 'row', // Align icon and text horizontally
    backgroundColor: 'transparent',
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center', // Vertically center the content
    borderWidth: 1,
    borderColor: colors.black,
    width: '90%',
  },
  buttonIcon: {
    marginRight: 10, // Space between icon and text
  },
  buttonText: {
    color: colors.black,
    fontSize: 18,
  },
  logoutButton: {
    borderColor: colors.red, // Red color for logout
  },
});

export default ProfileScreen;
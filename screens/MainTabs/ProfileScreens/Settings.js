// Settings.js

import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

function Settings({ navigation }) {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);

  const toggleNotifications = () => {
    setIsNotificationsEnabled((previousState) => !previousState);
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        { text: 'Logout', onPress: () => navigation.navigate('LandingScreen') },
      ],
      { cancelable: false }
    );
  };

  const performLogout = () => {
    // Add your logout logic here, such as clearing user data and navigating to the login screen
    // For example:
    // auth.signOut();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }], // Replace 'Login' with your actual login screen name
    });
  };

  return (
    <View style={styles.screenContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={30} color="#E83F10" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* Settings Options */}
      <ScrollView contentContainerStyle={styles.contentContainer}>

        {/* Notifications Option */}
        <View style={styles.optionContainer}>
          <View style={styles.optionLeft}>
            <Feather name="bell" size={24} color="white" />
            <Text style={styles.optionText}>Notifications</Text>
          </View>
          <Switch
            trackColor={{ false: '#767577', true: '#E83F10' }}
            thumbColor={isNotificationsEnabled ? '#ffffff' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleNotifications}
            value={isNotificationsEnabled}
          />
        </View>

        {/* Privacy Option */}
        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => navigation.navigate('Privacy')} // Replace with your Privacy screen route
        >
          <View style={styles.optionLeft}>
            <Feather name="lock" size={24} color="white" />
            <Text style={[styles.optionText]}>EULA</Text>
          </View>
          <Feather name="chevron-right" size={24} color="#555" />
        </TouchableOpacity>

        {/* About Option */}
        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => navigation.navigate('About')} // Replace with your About screen route
        >
          <View style={styles.optionLeft}>
            <Feather name="info" size={24} color="white" />
            <Text style={styles.optionText}>Terms and Conditions</Text>
          </View>
          <Feather name="chevron-right" size={24} color="#555" />
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.optionContainer, styles.logoutButton]}
          onPress={handleLogout}
        >
          <View style={styles.optionLeft}>
            <Feather name="log-out" size={24} color="#FF3B30" />
            <Text style={[styles.optionText, styles.logoutText]}>Logout</Text>
          </View>
          <Feather name="chevron-right" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    position: 'relative', // Add this line
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 55,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold'
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 15,
    fontFamily: 'Poppins_400Regular'
  },
  logoutButton: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  logoutText: {
    color: '#FF3B30',
    fontWeight: 'bold',
  },
});

export default Settings;
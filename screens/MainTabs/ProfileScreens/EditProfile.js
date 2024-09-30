import React, { useState } from 'react';
import { Alert, Text, View, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

function EditProfile({ navigation }) {
  // State hooks for handling input values (optional)
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [movieGenre, setMovieGenre] = useState('');
  const [favoriteColor, setFavoriteColor] = useState('');

  const handleSave = () => {
    // Implement save functionality here
    // For example, validate inputs and send to backend
    // After saving, navigate back or show a success message
    Alert.alert('Profile Updated', 'Your profile has been successfully updated.');
    navigation.goBack();
  };

  return (
    <View style={styles.screenContainer}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Feather name="arrow-left" size={30} color="#E83F10" />
      </TouchableOpacity>
      <Text style={{top: 55, position: 'absolute', color: 'white', alignSelf: 'center', fontFamily: 'Poppins_400Regular', fontSize: 24}}>Profile</Text>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.editProfileContainer}>
        {/* Basic Info Section */}
        <Text style={styles.sectionHeader}>Basic Info</Text>

        {/* Full Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your full name"
            placeholderTextColor="#888"
            style={styles.input}
          />
        </View>
        <View style={styles.separator} />

        {/* Email */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#888"
            keyboardType="email-address"
            style={styles.input}
          />
        </View>
        <View style={styles.separator} />

        {/* Password */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor="#888"
            secureTextEntry
            style={styles.input}
          />
        </View>
        <View style={styles.separator} />

        {/* Phone Number */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Enter your phone number"
            placeholderTextColor="#888"
            keyboardType="phone-pad"
            style={styles.input}
          />
        </View>
        <View style={styles.separator} />

        {/* Gender */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Gender</Text>
          <TextInput
            value={gender}
            onChangeText={setGender}
            placeholder="Enter your gender"
            placeholderTextColor="#888"
            style={styles.input}
          />
        </View>
        <View style={styles.separator} />

        {/* Personality Info Section */}
        <Text style={styles.sectionHeader}>Personality Info</Text>

        {/* Personality Info */}
        <View style={styles.inputContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Favorite Color</Text>
            <TextInput
              value={gender}
              onChangeText={setFavoriteColor}
              placeholder="Enter Color"
              placeholderTextColor="#888"
              style={styles.input}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Favorite Movie Genre</Text>
            <TextInput
              value={gender}
              onChangeText={setMovieGenre}
              placeholder="Enter Genre"
              placeholderTextColor="#888"
              style={styles.input}
            />
          </View>
        </View>
        <View style={styles.separator} />

        {/* Save Button */}
      </ScrollView>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: 100, // Adjust as needed
    width: '100%'
  },
  backButton: {
    position: 'absolute',
    top: 55,
    left: 20,
    zIndex: 1,
  },
  editProfileContainer: {
    alignItems: 'center',
    paddingBottom: 20, // To ensure content is above the save button
  },
  sectionHeader: {
    alignSelf: 'flex-start',
    marginLeft: '5%',
    marginTop: 20,
    marginBottom: 10,
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputContainer: {
    width: '90%',
    marginBottom: 10,
  },
  label: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#1c1c1c',
    color: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top', // For Android to align text at the top in multiline
  },
  separator: {
    width: '90%',
    height: 1,
    backgroundColor: '#444',
    marginVertical: 10,
  },
  saveButton: {
    alignSelf: 'center',
    width: '90%',
    backgroundColor: '#E83F10',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditProfile
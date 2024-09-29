import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Animated, Easing } from 'react-native';
import { Feather } from '@expo/vector-icons';

function PhoneNumber({ navigation, route }) {
  const { school, answers } = route.params;
  const [phoneNumber, setPhoneNumber] = useState('');
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const progress = 0.80;


  const handleNext = () => {
    if (phoneNumber) {
      navigation.navigate('EmailPasswordScreen', { phoneNumber, school, answers });
    } else {
      alert('Please enter a valid phone number');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Feather name="arrow-left" size={30} color="#E83F10" />
      </TouchableOpacity>

      <Text style={styles.title}>Phone Number</Text>

      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      <Animated.View style={{ opacity: fadeAnim }}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter your phone number"
          placeholderTextColor="#AAAAAA"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
        
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 20,
    paddingTop: 55,
  },
  backButton: {
    position: 'absolute',
    top: 55,
    left: 20,
    zIndex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
  },
  progressBarContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#333333',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#a37b73',
  },
  textInput: {
    backgroundColor: '#333333',
    color: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    fontSize: 18,
    fontFamily: 'Poppins_400Regular',
    width: '90%',
    alignSelf: 'center',
  },
  nextButton: {
    backgroundColor: '#E83F10',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
  },
});

export default PhoneNumber;
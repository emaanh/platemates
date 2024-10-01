import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Animated, Easing, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../stylevars';

function PhoneNumber({ navigation, route }) {
  const { school, answers } = route.params;
  const [phoneNumber, setPhoneNumber] = useState('');
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const progress = 0.80;

  // Function to format the phone number as XXX-XXX-XXXX
  const formatPhoneNumber = (text) => {
    // Remove all non-numeric characters
    const cleaned = text.replace(/\D/g, '').slice(0, 10); // Limit to 10 digits

    let formattedNumber = '';
    if (cleaned.length > 0) {
      formattedNumber += cleaned.substring(0, Math.min(3, cleaned.length));
    }
    if (cleaned.length >= 4) {
      formattedNumber += '-' + cleaned.substring(3, Math.min(6, cleaned.length));
    }
    if (cleaned.length >= 7) {
      formattedNumber += '-' + cleaned.substring(6, 10);
    }

    return formattedNumber;
  };

  const handlePhoneNumberChange = (text) => {
    const formatted = formatPhoneNumber(text);
    setPhoneNumber(formatted);
  };

  const handleNext = () => {
    // Remove dashes to validate the actual number length
    const cleanedNumber = phoneNumber.replace(/\D/g, '');
    if (cleanedNumber.length === 10) {
      navigation.navigate('EmailPasswordScreen', { phoneNumber: cleanedNumber, school, answers });
    } else {
      Alert.alert('Invalid Phone Number', 'Please enter a valid 10-digit phone number.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Feather name="arrow-left" size={30} color={colors.primary} />
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
          placeholderTextColor={colors.grey}
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={handlePhoneNumberChange}
          maxLength={12} // Format XXX-XXX-XXXX has 12 characters including dashes
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
    backgroundColor: colors.background,
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
    color: colors.black,
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
    backgroundColor: colors.dark_grey,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.progress_bar,
  },
  textInput: {
    backgroundColor: colors.dark_grey,
    color: colors.black,
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    fontSize: 18,
    fontFamily: 'Poppins_400Regular',
    width: '90%',
    alignSelf: 'center',
  },
  nextButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  nextButtonText: {
    color: colors.black,
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
  },
});

export default PhoneNumber;


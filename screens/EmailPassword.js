import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { db, authentication } from '../firebase/firebase-config';
import { setDoc, doc, serverTimestamp, addDoc, collection, getDoc } from 'firebase/firestore';
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, setPersistence, browserLocalPersistence } from "firebase/auth";
import { colors } from '../stylevars';
import * as Haptics from 'expo-haptics';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';

function EmailPassword({ navigation, route }) {

  const { school, answers } = route.params;
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const progress = 0.90;

  useEffect(() => {
    const handleUrl = async (url) => {
      if (isSignInWithEmailLink(authentication, url)) {
        try {
          const storedEmail = await AsyncStorage.getItem('emailForSignIn');
          if (!storedEmail) {
            Alert.prompt(
              'Sign In',
              'Please enter your email to complete sign in',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'OK',
                  onPress: async (inputEmail) => {
                    if (inputEmail && inputEmail.includes('@')) {
                      try {
                        await completeSignIn(inputEmail, url);
                      } catch (error) {
                        Alert.alert('Error', error.message);
                      }
                    } else {
                      Alert.alert('Invalid Email', 'Please enter a valid email address.');
                    }
                  },
                },
              ],
              'plain-text'
            );
          } else {
            await completeSignIn(storedEmail, url);
          }
        } catch (error) {
          Alert.alert('Error', 'Failed to retrieve email from storage.');
        }
      }
    };

    const getInitialURL = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleUrl(initialUrl);
      }
    };

    // Subscribe to URL events
    const urlListener = Linking.addEventListener('url', ({ url }) => {
      handleUrl(url);
    });

    getInitialURL();

    return () => {
      // Clean up the event listener
      urlListener.remove();
    };
  }, []);

  const completeSignIn = async (email, url) => {
    setLoading(true);
    try {
      await setPersistence(authentication, browserLocalPersistence);
      const result = await signInWithEmailLink(authentication, email, url);
      // Clear email from storage
      await AsyncStorage.removeItem('emailForSignIn');
      // User is signed in
      const uid = result.user.uid;

      // Check if user document exists
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        // If not, create it
        await setDoc(userDocRef, {
          fullName: fullName.trim(), // Ensure fullName is set appropriately
          email: email.trim(),
          phone: phoneNumber,
          answers: answers,
          shortSchool: school[1],
          longSchool: school[0],
          receiveSMS: true,
          receiveNotifications: true,
          tickets: [],
          inEvent: false,
          eventID: null,
          createdAt: serverTimestamp(),
        });

        await addDoc(collection(db, 'users', uid, 'notifications'), {
          timestamp: serverTimestamp(),
          message: 'Important Notifications Shown Here!',
          description: 'Check this screen for valuable info.'
        });

        await addDoc(collection(db, 'users', uid, 'events'), {
          timestamp: serverTimestamp(),
          title: 'Dinners Shown Here',
          eventID: 'hZt2oxXbroIJqLOVAlJy'
        })
      }

      navigation.navigate('QuoteScreen');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const emailDomain = email.trim().split('@')[1];
    if (emailDomain !== school[2]) {
      Alert.alert('Validation Error', 'Your email needs to be the domain: ' + school[2]);
      return;
    }

    const cleanedNumber = phoneNumber.replace(/\D/g, '');
    if (cleanedNumber.length !== 10) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid 10-digit phone number.');
      return;
    }

    if (fullName.trim() === '') {
      Alert.alert('Validation Error', 'Please enter your full name.');
      return;
    }

    if (email) {
      setLoading(true); // Show loading indicator
      try {
        const actionCodeSettings = {
          // URL you want to redirect back to. The domain (www.example.com) for this
          // URL must be whitelisted in the Firebase Console.
          url: 'https://platemates.page.link/tHrB', // Replace with your dynamic link
          handleCodeInApp: true,
          // iOS: {
          //   bundleId: 'com.yourapp.bundle',
          // },
          // android: {
          //   packageName: 'com.yourapp.package',
          //   installApp: true,
          //   minimumVersion: '12',
          // },
          // dynamicLinkDomain: 'yourapp.page.link', // Optional if set in Firebase
        };

        await sendSignInLinkToEmail(authentication, email, actionCodeSettings);
        await AsyncStorage.setItem('emailForSignIn', email);
        Alert.alert('Email Sent', 'A sign-in link has been sent to your email. Please check your inbox.');
        // Optionally navigate to a screen informing the user to check their email
      } catch (error) {
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false); // Hide loading indicator
      }
    } else {
      Alert.alert('Validation Error', 'Please enter your email.');
    }
  };

  const handlePhoneNumberChange = (text) => {
    const formatted = formatPhoneNumber(text);
    setPhoneNumber(formatted);
  };

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

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Feather name="arrow-left" size={30} color={colors.primary} />
      </TouchableOpacity>

      <Text style={styles.title}>Sign In with Email Link</Text>

      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      {/* Full Name TextInput */}
      <TextInput
        style={styles.textInput}
        placeholder="Enter your full name"
        placeholderTextColor={colors.grey}
        value={fullName}
        onChangeText={setFullName}
        autoCapitalize="words"
        returnKeyType="next"
      />

      {/* Phone Number TextInput */}
      <TextInput
        style={styles.textInput}
        placeholder="Enter your phone number"
        placeholderTextColor={colors.grey}
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={handlePhoneNumberChange}
        maxLength={12}
      />

      {/* Email TextInput */}
      <TextInput
        style={styles.textInput}
        placeholder="Enter your email"
        placeholderTextColor={colors.grey}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        returnKeyType="done"
      />

      <TouchableOpacity style={styles.nextButton} onPress={handleSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.black} />
        ) : (
          <Text style={styles.nextButtonText}>Send Sign-In Link</Text>
        )}
      </TouchableOpacity>
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
    fontFamily: 'LibreBaskerville_700Bold',
    top: 10,
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
    backgroundColor: colors.background,
    color: colors.black,
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    fontSize: 18,
    fontFamily: 'Poppins_400Regular',
    width: '90%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: colors.black
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

export default EmailPassword;
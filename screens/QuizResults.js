import React, { useState, useEffect, useRef, useContext } from 'react';
import { Alert, StyleSheet, TouchableOpacity, Text, View, Animated, Easing } from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '../stylevars';
import { signInWithCredential, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { authentication,db } from '../firebase/firebase-config';

import { setDoc, doc, getDoc, serverTimestamp, addDoc, collection } from 'firebase/firestore';

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { AuthContext } from '../AuthProvider';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { appleAuth } from '@invertase/react-native-apple-authentication';



function QuizResults({ navigation, route }) {
  const [isMatching, setIsMatching] = useState(true);
  const [compatibleStudents, setCompatibleStudents] = useState(0);
  const { school, answers } = route.params;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const { signOut, setUser, deviceID } = useContext(AuthContext);



  useEffect(() => {

    GoogleSignin.configure({
      webClientId: '970420223223-8dpfrs1gsqt77aj67s25ogn4lnc9r8oo.apps.googleusercontent.com',
      offlineAccess: true,
    });


    const randomStudents = Math.floor(Math.random() * 23) + 8;
    setCompatibleStudents(randomStudents);


    const timer = setTimeout(() => {
      setIsMatching(false);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }, 3000);

    const startRotation = () => {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    };

    startRotation();

    return () => clearTimeout(timer);
  }, [rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const signInWithApple = async () => {
    try {
      // Start the sign-in request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });
  
      // Ensure user is authenticated
      if (!appleAuthRequestResponse.identityToken) {
        throw 'Apple Sign-In failed - no identity token returned';
      }
  
      // Create a Firebase credential from the response
      const { identityToken, nonce } = appleAuthRequestResponse;
      const provider = new OAuthProvider('apple.com');
      const credential = provider.credential({
        idToken: identityToken,
        rawNonce: nonce,
      });
  
      // Sign in with Firebase
      const userCredential = await signInWithCredential(authentication, credential);
      console.log(userCredential.user);
  
      // Additional logic (e.g., checking email domain)
      const userEmail = userCredential.user.email;
      console.log(userCredential.user);
      const emailDomain = userEmail.split('@')[1];

      await setDoc(doc(db,'analytics',deviceID),{ appleSignIn: true },{merge:true});
  
      // if (emailDomain !== school[2]) {
      //   Alert.alert('Email domain does not match the required school domain.');
      //   await signOut();
      //   return;
      // }
  
      const userSnap = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (userSnap.exists()) {
        Alert.alert(
          'Account Already Registered',
          'This account has already been registered. Please choose an option below.',
          [
            {
              text: 'Try Again',
              onPress: () => {
                console.log('Trying again');
              },
              style: 'cancel',
            },
            {
              text: 'Login',
              onPress: () => {
                navigation.navigate('MainScreen');
              },
            },
          ],
          { cancelable: false }
        );
        return;
      }

      await AsyncStorage.setItem('school', JSON.stringify(school));
      await AsyncStorage.setItem('answers', JSON.stringify(answers));
      navigation.navigate('GoogleInfoScreen', { apple: true });
    } catch (error) {
      console.error('Apple Sign-In Error:', error);
    }
  };

  // Implement the sign-in with Google function
  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const userInfo = await GoogleSignin.signIn();
      const { data } = userInfo;
      const idToken = data.idToken;
      const googleCredential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(authentication, googleCredential);
      const userEmail = userCredential.user.email;
      const emailDomain = userEmail.split('@')[1];

      await setDoc(doc(db,'analytics',deviceID),{ googleSignIn: true },{merge:true});


      if (emailDomain !== school[2]) {
        Alert.alert('Email domain does not match the required school domain.');
        await signOut();

        return;
      }

      const userSnap = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (userSnap.exists()) {
        Alert.alert(
          'Account Already Registered',
          'This account has already been registered. Please choose an option below.',
          [
            {
              text: 'Try Again',
              onPress: () => {
                // Optional: Reset form fields or perform any other action
                console.log('Trying again');
              },
              style: 'cancel', // This makes the button bold on iOS
            },
            {
              text: 'Login',
              onPress: () => {
                // Navigate to the Login screen
                navigation.navigate('MainScreen'); // Ensure 'Login' is the correct route name
              },
            },
          ],
          { cancelable: false } // Prevents the alert from being dismissed by tapping outside
        );
        return; // Exit the function since the user is already registered
      }

      // await setDoc(doc(db, 'users', userCredential.user.uid), {
      //   email: userEmail.trim(),
      //   tickets: []
      // },{merge:true});


      await AsyncStorage.setItem('school', JSON.stringify(school));
      await AsyncStorage.setItem('answers', JSON.stringify(answers));
      navigation.navigate('GoogleInfoScreen', { apple: false });
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      {isMatching ? (
        <>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Svg height="100" width="100" viewBox="0 0 100 100">
              <Circle
                cx="50"
                cy="50"
                r="40"
                stroke={colors.white}
                strokeWidth="5"
                fill="none"
                strokeDasharray="251.2"
                strokeDashoffset="50"
              />
            </Svg>
          </Animated.View>
          <Text style={styles.resultsText}>Matching You With Compatible Students</Text>
        </>
      ) : (
        <>
          <Feather name="check-circle" style={{marginTop: -40}} size={100} color={colors.background} />
          <Text style={styles.resultsText}>
            We have found {compatibleStudents} compatible students at {school[1]}
          </Text>
          <View style={styles.buttonContainer}>
            <Text style={{fontFamily: 'Poppins_400Regular', marginBottom: 35, color: colors.light_grey,fontSize: 18,textAlign: 'center',top: 20,width: '100%'}}>Use your university email to sign in.</Text>
            <TouchableOpacity style={styles.googleButton} onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              signInWithGoogle()}}>
              <FontAwesome name="google" size={24} color="#333333" style={styles.googleIcon} />
              <Text style={styles.googleButtonText}>Sign up with Google</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.appleButton} onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              signInWithApple();
              }}>
              <FontAwesome name="apple" size={24} color="#333333" style={styles.appleIcon} />
              <Text style={styles.appleButtonText}>Sign up with Apple</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.emailButton}
              onPress={async() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); 
                navigation.navigate('EmailPasswordScreen', { school, answers });
                await setDoc(doc(db,'analytics',deviceID),{ emailSignIn: true },{merge:true});
              }}>
              <Text style={styles.emailButtonText}>Sign up with email</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.yellow, // Yellow background
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchingText: {
    marginTop: 20,
    color: colors.black,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Poppins_700Bold',
  },
  resultsText: {
    marginTop: 20,
    color: colors.background,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Poppins_700Bold',//'LibreBaskerville_700Bold',
    width: '90%',
  },
  emailButton: {
    backgroundColor: colors.black, // Dark grey buttons
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: '90%',
    alignItems: 'center',
  },
  emailButtonText: {
    color: colors.white, // White text on the buttons
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40, // Distance from the bottom of the screen, adjust as needed
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleButton: {
    backgroundColor: '#ffffff', // Dark grey buttons
    flexDirection: 'row', // To align the icon with the text
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '90%',
    alignItems: 'center',
  },
  googleButtonText: {
    color: '#333333', // Dark grey text on the buttons
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
    marginLeft: 10, // Add some space between the icon and the text
  },
  googleIcon: {
    marginRight: 2.5, // Add space between icon and text
  },
  appleButton: {
    backgroundColor: '#ffffff', // White background
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    width: '90%',
  },
  appleButtonText: {
    color: '#333333', // Dark grey text
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
    marginLeft: 10, // Space between the icon and the text
  },
  appleIcon: {
    marginRight: 2.5, // Space between icon and text
  },
});

export default QuizResults;
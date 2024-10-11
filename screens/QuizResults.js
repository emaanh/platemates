import React, { useState, useEffect, useRef, useContext } from 'react';
import { Alert, StyleSheet, TouchableOpacity, Text, View, Animated, Easing } from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '../stylevars';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { authentication,db } from '../firebase/firebase-config';

import { setDoc,doc } from 'firebase/firestore';

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { AuthContext } from '../AuthProvider';
import * as Haptics from 'expo-haptics';



function QuizResults({ navigation, route }) {
  const [isMatching, setIsMatching] = useState(true);
  const [compatibleStudents, setCompatibleStudents] = useState(0);
  const { school, answers } = route.params;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const { signOut, setUser } = useContext(AuthContext);



  useEffect(() => {

    GoogleSignin.configure({
      webClientId: '970420223223-8dpfrs1gsqt77aj67s25ogn4lnc9r8oo.apps.googleusercontent.com',
      offlineAccess: true,
    });


    const randomStudents = Math.floor(Math.random() * 46) + 5;
    setCompatibleStudents(randomStudents);

    const timer = setTimeout(() => {
      setIsMatching(false);
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


      if (emailDomain !== school[2]) {
        Alert.alert('Email domain does not match the required school domain.');
        await signOut();

        return;
      }

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: userEmail.trim(),
        tickets: []
      },{merge:true});

      navigation.navigate('GoogleInfoScreen', { uid: userCredential.user.uid, email: userCredential.user.email, school, answers });
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
          <Feather name="check-circle" size={100} color={colors.background} />
          <Text style={styles.resultsText}>
            We have found {compatibleStudents} compatible students at {school[1]}
          </Text>
          <TouchableOpacity
            style={styles.emailButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); 
              navigation.navigate('PhoneNumberScreen', { school, answers })}}>
            <Text style={styles.emailButtonText}>Sign up with email</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.googleButton} onPress={()=> {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            signInWithGoogle()}}>
            <FontAwesome name="google" size={24} color="#333333" style={styles.googleIcon} />
            <Text style={styles.googleButtonText}>Sign up with Google</Text>
          </TouchableOpacity>
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
    position: 'absolute',
    backgroundColor: colors.black, // Dark grey buttons
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10, // Space between buttons
    alignItems: 'center',
    bottom: 50,
    width: '90%',
    alignItems: 'center',
  },
  emailButtonText: {
    color: colors.white, // White text on the buttons
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
  },
  googleButton: {
    position: 'absolute',
    backgroundColor: '#ffffff', // Dark grey buttons
    flexDirection: 'row', // To align the icon with the text
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10, // Space between buttons
    bottom: 120,
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
});

export default QuizResults;
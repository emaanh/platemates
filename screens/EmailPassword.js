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
  

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const progress = 0.90;

  useEffect(() => {
    const handleDeepLink = async (event) => {
      const url = event.url;
      const { queryParams } = Linking.parse(url);
      const isRegister = queryParams.register === 'false';

      if(isRegister){
        return;
      }

      if (isSignInWithEmailLink(authentication, url)) {
        const storedEmail = await AsyncStorage.getItem('emailForSignIn');
        const result = await signInWithEmailLink(authentication, storedEmail, url);
        console.log('result:',result);
        const userSnap = await getDoc(doc(db, 'users', result.user.uid));
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
    

        // await setDoc(doc(db, 'users', result.user.uid), {
        //   email: storedEmail.trim(),
        //   tickets: []
        // },{merge:true});

        await AsyncStorage.removeItem('emailForSignIn');

        console.log('navigated');
        navigation.navigate('GoogleInfoScreen',{apple: false});
      }

    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    (async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleDeepLink({ url: initialUrl });
      }
    })();

    return () => {
      subscription.remove();
    };
  }, []);

  const handleSubmit = async () => {
    const emailDomain = email.trim().split('@')[1];
    if (emailDomain !== school[2]) {
      Alert.alert('Validation Error', 'Your email needs to be the domain: ' + school[2]);
      return;
    }

    if (email) {
      setLoading(true); // Show loading indicator
      try {
        const actionCodeSettings = {
          url: 'https://platemates.page.link/tHrB?register=true',
          handleCodeInApp: true,
        };

        await sendSignInLinkToEmail(authentication, email, actionCodeSettings);
        await AsyncStorage.setItem('emailForSignIn', email);
        await AsyncStorage.setItem('school', JSON.stringify(school));
        await AsyncStorage.setItem('answers', JSON.stringify(answers));
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        Alert.alert('Select "Default browser app" when opening the email link', 'A sign-in link has been sent to your email');
      } catch (error) {
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('Validation Error', 'Please enter your email.');
    }
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
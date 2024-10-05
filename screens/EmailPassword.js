import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { db, authentication } from '../firebase/firebase-config';
import { setDoc, doc, serverTimestamp, addDoc, collection } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { colors } from '../stylevars';

function EmailPassword({ navigation, route }) {

  const { phoneNumber, school, answers } = route.params;
  
  // 1. Add state for full name
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const progress = 0.90;

  const handleSubmit = async () => {
    // 4. Update validation to include full name
    const emailDomain = email.trim().split('@')[1];
    if (emailDomain !== school[2]) {
      Alert.alert('Validation Error', 'Your email needs to be the domain: ' + school[2]);
      return;
    }

    if (fullName.trim() === '') {
      Alert.alert('Validation Error', 'Please enter your full name.');
      return;
    }

    if (email && password && confirmPassword && password === confirmPassword) {
      setLoading(true); // Show loading indicator
      try {
        const answersMap = new Map(Object.entries(answers));
        const answersObject = Object.fromEntries(answersMap);

        const userCredential = await createUserWithEmailAndPassword(authentication, email, password);
        const uid = userCredential.user.uid;

        await setDoc(doc(db, 'users', uid), {
          fullName: fullName.trim(), // 3. Include full name in Firestore
          email: email.trim(),
          phone: phoneNumber,
          answers: answersObject,
          shortSchool: school[1],
          longSchool: school[0],
          receiveSMS: true,
          receiveNotifications: true,
        });

        await addDoc(collection(db, 'users', uid, 'notifications'), {
          timestamp: serverTimestamp(),
          message: 'Important Notifications Shown Here!'
        });

        await addDoc(collection(db, 'users', uid, 'events'), {
          timestamp: serverTimestamp(),
          title: 'Dinners Shown Here'
        });

        navigation.navigate('QuoteScreen');

      } catch (error) {
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false); // Hide loading indicator
      }
    } else {
      Alert.alert('Validation Error', 'Please make sure all fields are filled and passwords match.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Feather name="arrow-left" size={30} color={colors.primary} />
      </TouchableOpacity>

      <Text style={styles.title}>Email and Password</Text>

      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      {/* 2. Add Full Name TextInput at the top */}
      <TextInput
        style={styles.textInput}
        placeholder="Enter your full name"
        placeholderTextColor={colors.grey}
        value={fullName}
        onChangeText={setFullName}
        autoCapitalize="words"
        returnKeyType="next"
      />

      <TextInput
        style={styles.textInput}
        placeholder="Enter your email"
        placeholderTextColor={colors.grey}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        returnKeyType="next"
      />

      <TextInput
        style={styles.textInput}
        placeholder="Enter your password"
        placeholderTextColor={colors.grey}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        returnKeyType="next"
      />

      <TextInput
        style={styles.textInput}
        placeholder="Confirm your password"
        placeholderTextColor={colors.grey}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        autoCapitalize="none"
        returnKeyType="done"
      />

      <TouchableOpacity style={styles.nextButton} onPress={handleSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.black} />
        ) : (
          <Text style={styles.nextButtonText}>Submit</Text>
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
    backgroundColor: colors.primary,
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
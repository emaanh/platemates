import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { db, authentication } from '../firebase/firebase-config';
import { setDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from "firebase/auth";

function EmailPassword({ navigation, route }) {
  
  const { phoneNumber, school, answers } = route.params;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const progress = 0.90;

  const handleSubmit = async () => {
    if (email && password && confirmPassword && password === confirmPassword) {
      const userCredential = await createUserWithEmailAndPassword(authentication, email, password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db,'users',uid),{email:email, phone: phoneNumber, school, answers})
      console.log('Email:', email);
      console.log('Password:', password);
      console.log('Phone Number:', phoneNumber);
      console.log('School', school);
      console.log('Answers', answers);
    } else {
      alert('Please make sure all fields are filled and passwords match');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Feather name="arrow-left" size={30} color="#E83F10" />
      </TouchableOpacity>

      <Text style={styles.title}>Email and Password</Text>

      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      <TextInput
        style={styles.textInput}
        placeholder="Enter your email"
        placeholderTextColor="#AAAAAA"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      
      <TextInput
        style={styles.textInput}
        placeholder="Enter your password"
        placeholderTextColor="#AAAAAA"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.textInput}
        placeholder="Confirm your password"
        placeholderTextColor="#AAAAAA"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.nextButton} onPress={handleSubmit}>
        <Text style={styles.nextButtonText}>Submit</Text>
      </TouchableOpacity>
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

export default EmailPassword;
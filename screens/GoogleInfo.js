import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { db, authentication } from '../firebase/firebase-config';
import { setDoc, doc, serverTimestamp, addDoc, collection } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { colors } from '../stylevars';
import { AuthContext } from '../AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

function GoogleInfo({ navigation, route }) {

    const { user } = useContext(AuthContext);
    if(user==null){
      return;
    }

    const uid = user.uid;
    const email = user.email;
  
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false); // Loading state
    const progress = 0.90;

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

    const handleSubmit = async () => {
        // 4. Update validation to include full name
        if (fullName.trim() === '') {
            Alert.alert('Validation Error', 'Please enter your full name.');
            return;
        }
      
        if (phoneNumber.trim() === '') {
            Alert.alert('Validation Error', 'Please enter your phone number.');
            return;
        }

        if (email) {
          setLoading(true); // Show loading indicator
          try {
            const school = JSON.parse(await AsyncStorage.getItem('school'));
            const answers = JSON.parse(await AsyncStorage.getItem('answers'));
            const answersMap = new Map(Object.entries(answers));
            const answersObject = Object.fromEntries(answersMap);
            await AsyncStorage.removeItem('school');
            await AsyncStorage.removeItem('answers');

    
            await setDoc(doc(db, 'users', uid), {
              fullName: fullName.trim(), // 3. Include full name in Firestore
              email: email.trim(),
              phone: phoneNumber,
              answers: answersObject,
              shortSchool: school[1],
              longSchool: school[0],
              receiveSMS: true,
              receiveNotifications: true,
              tickets: [],
              inEvent: false,
              eventID: null
            },{merge:true});
    
            await addDoc(collection(db, 'users', uid, 'notifications'), {
              timestamp: serverTimestamp(),
              message: 'Important Notification',
              description: 'Check this screen for valuable info.'
            });
    
            await addDoc(collection(db, 'users', uid, 'events'), {
              timestamp: serverTimestamp(),
              title: 'Dinners Shown Here',
              eventID: 'hZt2oxXbroIJqLOVAlJy'
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
  
        <Text style={styles.title}>Your Information</Text>
  
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>
  
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
          placeholder="Enter your phone number"
          placeholderTextColor={colors.grey}
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={handlePhoneNumberChange}
          maxLength={12}
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
        borderColor: colors.black,
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

export default GoogleInfo;
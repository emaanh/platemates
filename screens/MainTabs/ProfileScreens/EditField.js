import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../../stylevars';
import { AuthContext } from '../../../AuthProvider';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase/firebase-config';

function EditField({ navigation, route }) {
  const { field, index } = route.params;
  const { userData, user } = useContext(AuthContext);
  console.log(userData[field]);

  const formatPhoneNumber = (text) => {
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

  const fieldLabels = {
    fullName: 'Full Name',
    email: 'Email',
    phone: 'Phone Number',
  };
  let tempValue;
  if(field == 'phone'){
    tempValue = formatPhoneNumber(userData[field]);
  }
  else{
    tempValue = userData[field];
  }

  const [value, setValue] = useState(tempValue || '');


  const handleValueChange = (text) => {
    if (field === 'phone') {
      const formatted = formatPhoneNumber(text);
      setValue(formatted);
    } else {
      setValue(text);
    }
  };

  const handleSubmit = async () => {
    if (field === 'email') {
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(value)) {
        Alert.alert('Invalid Email', 'Please enter a valid email address.');
        return;
      }
    } else if (field === 'phone') {
      const cleanedNumber = value.replace(/\D/g, '');
      if (cleanedNumber.length !== 10) {
        Alert.alert('Invalid Phone Number', 'Please enter a valid 10-digit phone number.');
        return;
      }
    } else if (field === 'fullName') {
      if (value.trim() === '') {
        Alert.alert('Invalid Name', 'Name cannot be empty.');
        return;
      }
    }

    await setDoc(
      doc(db, 'users', user.uid),
      { [field]: value },
      { merge: true }
    );
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Feather name="arrow-left" size={30} color={colors.primary} />
      </TouchableOpacity>

      <Text style={styles.title}>{fieldLabels[field]}</Text>

      <TextInput
        style={styles.textInput}
        placeholder={`Enter your ${fieldLabels[field]}`}
        placeholderTextColor={colors.black}
        keyboardType={field === 'phone' ? 'phone-pad' : 'default'}
        value={value}
        onChangeText={handleValueChange}
        maxLength={field === 'phone' ? 12 : undefined} // For formatted phone number
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
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
  textInput: {
    backgroundColor: 'transparent',
    color: colors.black,
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    fontSize: 18,
    fontFamily: 'Poppins_400Regular',
    width: '90%',
    alignSelf: 'center',
    borderColor: colors.black,
    borderWidth: 1
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
  },
});

export default EditField;
import React, { useLayoutEffect, useEffect, useContext, useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../stylevars';
import * as Haptics from 'expo-haptics';
import { AuthContext } from '../AuthProvider';
import { onSnapshot, doc, updateDoc, getDoc, setDoc, deleteDoc, getDocs, collection, serverTimestamp, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';


function SelectSchool({ navigation }) {
  const { schools, deviceID } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('LandingScreen')}>
        <Feather name="arrow-left" size={30} color={colors.black} />
      </TouchableOpacity>

      <Text style={styles.title}>Where would you like to have your dinners?</Text>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {schools.map((school, index) => (
          <View style={styles.shadowContainer}>
            <TouchableOpacity
              key={index}
              style={styles.schoolButton}
              onPress={async() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                navigation.navigate('PersonalityQuizScreen', { school });
                await setDoc(doc(db,'analytics',deviceID),{ school },{merge:true});
              }}>
              <Text style={styles.schoolButtonText}>{school[0]}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // Black background
    paddingHorizontal: 20,
    paddingTop: 90,
  },
  backButton: {
    position: 'absolute',
    top: 55,
    left: 20,
    zIndex: 1,
  },
  title: {
    color: colors.black, // White text for the title
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    width: '80%',
    textAlign: 'center',
    alignSelf: 'center',
    fontFamily: 'LibreBaskerville_700Bold',
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  schoolButton: {
    backgroundColor: colors.background, // Dark grey buttons
    borderColor: colors.dark_grey,
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10, // Space between buttons
    alignItems: 'center',
  },
  shadowContainer: {
    borderRadius: 8,
    padding: 2,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15},
    shadowOpacity: 0.05,
    shadowRadius: 8,

    elevation: 5,
  },
  schoolButtonText: {
    color: colors.black, // White text on the buttons
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
  },
});

export default SelectSchool;
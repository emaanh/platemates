import React, { useLayoutEffect, useEffect, useContext, useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

function SelectSchool({ navigation }) {
  const schools = [
    "University of Southern, California",
    "University of California, Berkeley",
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Feather name="arrow-left" size={30} color="white" />
      </TouchableOpacity>

      <Text style={styles.title}>Where would you like to have your dinners?</Text>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {schools.map((school, index) => (
          <TouchableOpacity
            key={index}
            style={styles.schoolButton}
            onPress={() => navigation.navigate('PersonalityQuizScreen', { school })}
          >
            <Text style={styles.schoolButtonText}>{school}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Black background
    paddingHorizontal: 20,
    paddingTop: 90,
  },
  backButton: {
    position: 'absolute',
    top: 55, // Adjust based on the status bar height
    left: 20,
    zIndex: 1, // Ensure the button stays on top
  },
  title: {
    color: '#FFFFFF', // White text for the title
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    width: '80%',
    textAlign: 'center',
    alignSelf: 'center',
    fontFamily: 'Poppins_400Regular',
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  schoolButton: {
    backgroundColor: '#333333', // Dark grey buttons
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10, // Space between buttons
    alignItems: 'center',
  },
  schoolButtonText: {
    color: '#FFFFFF', // White text on the buttons
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
  },
});

export default SelectSchool;
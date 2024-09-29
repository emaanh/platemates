import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { doc, updateDoc, getDoc, setDoc, deleteDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebase/firebase-config';

function HomeScreen() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [school, setSchool] = useState(null);
  let uid = 'o7k7K3yfJFVlxKxyedNZIdc4mcG2';

  useEffect(() => {
    (async () => {
      const userSnap = await getDoc(doc(db, 'users', uid));
      const userData = userSnap.data();
      const schoolSnap = userData.shortSchool;
      setSchool(schoolSnap);
    })();
  }, [uid]);

  return (
    <View style={styles.screenContainer}>
      {/* Description */}
      <Text style={styles.title}>{school}</Text>
      <Text style={styles.description}>Select the date for a dinner with 3 students selected by our algorithm</Text>

      {/* Date Buttons */}
      <View style={styles.optionsContainer}>
        {['October 9th', 'October 16th', 'October 23rd'].map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={() => setSelectedOption(option)}
          >
            <View style={styles.buttonContent}>
              <View style={styles.textContainer}>
                <Text style={styles.dateText}>Wednesday, {option}</Text>
                <Text style={styles.subText}>7:00 PM</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.radialButton,
                  selectedOption === option && styles.selectedRadial,
                ]}
                onPress={() => setSelectedOption(option)}
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Red Button */}
      <TouchableOpacity
        style={[styles.bottomButton, !selectedOption && styles.disabledButton]}
        onPress={() => console.log('Red button pressed')}
        disabled={!selectedOption}
      >
        <Text style={styles.bottomButtonText}>Book my seat</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24, // Adjust this size as needed
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Poppins_700Bold'
  },
  description: {
    color: 'grey',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'left',
    width: '85%',
    fontFamily: 'Poppins_400Regular'
  },
  optionsContainer: {
    marginBottom: 20,
    width: '100%',
  },
  button: {
    top: 160,
    backgroundColor: 'transparent',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'white',
    width: '90%',
    alignSelf: 'center',
    marginVertical: 10,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  radialButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'transparent',
  },
  selectedRadial: {
    backgroundColor: 'red',
  },
  textContainer: {
    flexDirection: 'column',
  },
  dateText: {
    color: 'white',
    fontSize: 16, 
    fontWeight: 'bold',
  },
  subText: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
  },
  bottomButton: {
    top: 150,
    backgroundColor: 'red',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '90%',
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: 'grey',
  },
  bottomButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
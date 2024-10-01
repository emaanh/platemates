import React, { useEffect, useState, useContext } from 'react';
import { Modal, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { doc, updateDoc, getDoc, setDoc, deleteDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebase/firebase-config';
import { colors } from '../../stylevars';
// import { SafeAreaView } from 'react-native-safe-area-context';
import PriceModal from './PriceModal'; 
import { AuthContext } from '../../AuthProvider';


function HomeScreen({ setUserInEvent }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [school, setSchool] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(true);

  const { user, userData } = useContext(AuthContext);
  console.log(userData);


  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={styles.screenContainer}>
      {/* Description */}
      <Text style={styles.title}>UC Berkeley</Text>
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

      <TouchableOpacity
        style={[styles.bottomButton, !selectedOption && styles.disabledButton]}
        onPress={() => openModal()}
        disabled={!selectedOption}
      >
        <Text style={styles.bottomButtonText}>Book my seat</Text>
      </TouchableOpacity>

      <PriceModal 
        isVisible={isModalVisible} 
        closeModal={closeModal} 
        setUserInEvent={setUserInEvent}
        onClose={closeModal} 
        selectedOption={selectedOption} 
        setSelectedOption={setSelectedOption} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24, // Adjust this size as needed
    color: colors.black,
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Poppins_700Bold'
  },
  description: {
    color: colors.grey,
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
    top: 140,
    backgroundColor: 'transparent',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.black,
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
    backgroundColor: colors.primary,
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
    top: 120,
    backgroundColor: colors.primary,
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

  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  closeButton: {
    position: 'absolute',
    top: 55, // Adjust based on SafeAreaView
    right: 20,
    zIndex: 1,
    padding: 10,
  },
  closeButtonText: {
    color: colors.black,
    fontSize: 30,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalTitle: {
    color: colors.black,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Poppins_700Bold',
  },
  modalDescription: {
    color: colors.grey,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
  },
});

export default HomeScreen;
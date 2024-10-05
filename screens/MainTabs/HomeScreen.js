import React, { useEffect, useState, useContext } from 'react';
import { Image, Modal, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { doc, updateDoc, getDoc, setDoc, deleteDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebase/firebase-config';
import { colors } from '../../stylevars';
// import { SafeAreaView } from 'react-native-safe-area-context';
import PriceModal from './PriceModal'; 
import { AuthContext } from '../../AuthProvider';


function HomeScreen({ setUserInEvent }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [school, setSchool] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { user, userData } = useContext(AuthContext);



  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={styles.screenContainer}>
      {/* Description */}
      <Image 
        source={require('../../assets/logo_plates.png')} 
        style={styles.logoImage} 
        resizeMode="contain"
      />
      {/* Date Buttons */}
      <View style={[styles.optionsContainer,{width: '90%',position: 'absolute', bottom: '2%'}]}>
        <Text style={[styles.title]}>UC Berkeley</Text>
        <Text style={[styles.description]}>Select the date for a dinner with 3 students selected by our algorithm</Text>
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
        <TouchableOpacity
          style={[styles.bottomButton, !selectedOption && styles.disabledButton]}
          onPress={() => openModal()}
          disabled={!selectedOption}
        >
          <Text style={styles.bottomButtonText}>Book my seat</Text>
        </TouchableOpacity>
      </View>


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
  contentContainer: {
    width: '90%', // Adjust this width as needed to fit within the screen
    alignSelf: 'center', // Centers this container within the parent container
    paddingHorizontal: 20, // Adjust the padding to control the internal spacing
  },
  title: {
    fontSize: 24,
    color: colors.black,
    marginBottom: 20,
    textAlign: 'left',
    fontFamily: 'LibreBaskerville_700Bold',
    paddingHorizontal: 2.5
  },
  description: {
    paddingHorizontal: 2.5,
    marginBottom: 15,
    color: colors.grey,
    fontSize: 16,
    textAlign: 'left',
    fontFamily: 'Poppins_400Regular',
  },
  optionsContainer: {
    marginBottom: 20,
    width: '100%',
  },
  button: {
    backgroundColor: 'transparent',
    paddingVertical: 17,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.black,
    width: '100%',
    alignSelf: 'center',
    marginVertical: 13,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  radialButton: {
    width: 20,
    height: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.black,
    backgroundColor: 'transparent',
  },
  selectedRadial: {
    backgroundColor: colors.primary,
  },
  textContainer: {
    flexDirection: 'column',
  },
  dateText: {
    color: colors.black,
    fontSize: 16, 
    fontWeight: 'bold',
  },
  subText: {
    color: colors.dark_grey,
    fontSize: 14,
    marginTop: 10,
  },
  bottomButton: {
    top: 0,
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: colors.grey,
  },
  bottomButtonText: {
    color: colors.background,
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
  logoImage: {
    width: '100%',
    height: '100%',
  },
});

export default HomeScreen;
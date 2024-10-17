import React, { useEffect, useState, useContext } from 'react';
import { Alert, Image, Modal, Text, View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { doc, updateDoc, getDoc, setDoc, deleteDoc, getDocs, collection, serverTimestamp, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase-config';
import { colors } from '../../stylevars';
import PriceModal from './PriceModal'; 
import { AuthContext } from '../../AuthProvider';
import moment from 'moment';
import { MaterialIndicator } from 'react-native-indicators';
import * as Progress from 'react-native-progress';

function HomeScreen({ toggleUserInEvent }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [school, setSchool] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFindingDinner, setIsFindingDinner] = useState(false); // New state variable
  const [loadingComplete, setLoadingComplete] = useState(false);

  const { user, userData, subscribed, hasTicket } = useContext(AuthContext);

  const [nextWednesdays, setNextWednesdays] = useState([]);

  useEffect(() => {
    // Function to get the next 3 Wednesdays
    const getNextWednesdays = () => {
      let wednesdays = [];
      let now = moment(); // Current time
  
      // Function to set time to 12:00 PM
      const setToNoon = (date) => {
        return date.clone().set({ hour: 12, minute: 0, second: 0, millisecond: 0 });
      };
  
      // Find the next Wednesday after the current time
      let nextWednesday = now.clone().day(3); // Wednesday is day 3 (Sunday = 0)
  
      // If today is after Wednesday or it's Wednesday and past 12:00 PM, move to next week's Wednesday
      if (now.day() > 3 || (now.day() === 3 && now.hour() >= 12)) {
        nextWednesday.add(1, 'week').day(3);
      }
  
      // Now, get the next 3 Wednesdays
      for (let i = 0; i < 3; i++) {
        let wednesday = nextWednesday.clone().add(i, 'weeks');
        wednesdays.push(setToNoon(wednesday));
      }
  
      return wednesdays;
    };

    setNextWednesdays(getNextWednesdays());
  }, []);

  const bookPressed = async() => {
    if(!subscribed && !hasTicket){
      openModal();
      return;
    }

    if(subscribed){
      PromptSubscribe();
    }

    if(hasTicket){
      PromptTicket();
    }
  };

  const PromptSubscribe = async() => {
    Alert.alert(
      "Confirm Booking",
      "Are you sure you want to book this date?",
      [
        {
          text: "Cancel",
          onPress: () => {
            console.log("Booking cancelled");
            // Optional: Any additional cancellation logic
          },
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            joinDinnerQueueSubscribe();
          },
        },
      ],
      { cancelable: false } // Prevents dismissal by tapping outside
    );
  }

  const PromptTicket = async() => {
    Alert.alert(
      "Confirm Booking",
      "Are you sure you want to book this date? Once booked, your ticket will be used.",
      [
        {
          text: "Cancel",
          onPress: () => {
            console.log("Booking cancelled");
            // Optional: Any additional cancellation logic
          },
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            joinDinnerQueueTickets();
          },
        },
      ],
      { cancelable: false } // Prevents dismissal by tapping outside
    );
  }

  const joinDinnerQueueSubscribe = async() => {
    setIsFindingDinner(true); // Show the modal
    const formattedOption = selectedOption.set({ hour: 19, minute: 0, second: 0, millisecond: 0 }).format('YYYY-MM-DD HH:mm:ss');
    await addDoc(collection(db,'queue'),{uid: user.uid, name: userData.fullName, timestamp: serverTimestamp(), selectedDinner: formattedOption });

    // Simulate loading time between 8-16 seconds
    const delay = Math.floor(Math.random() * (4 - 2 + 1) + 2) * 300;
    setTimeout(async() => {
      setIsFindingDinner(false); // Hide the modal
      toggleUserInEvent(true);
      await setDoc(doc(db,'users',user.uid),{inEvent: true, selectedDinner: formattedOption},{merge:true});
    }, delay);
  };

  const joinDinnerQueueTickets = async() => {
    setIsFindingDinner(true); // Show the modal
    const formattedOption = selectedOption.clone().add(7, 'hours').set({ hour: 19, minute: 0, second: 0, millisecond: 0 }).format('YYYY-MM-DD HH:mm:ss');
    await addDoc(collection(db,'queue'),{uid: user.uid, name: userData.fullName, timestamp: serverTimestamp(), selectedDinner: formattedOption });

    // Simulate loading time between 8-16 seconds
    const delay = Math.floor(Math.random() * (8 - 4 + 1) + 4) * 1000; // Random between 8 and 16 seconds
    setTimeout(async() => {
      setIsFindingDinner(false); // Hide the modal
      toggleUserInEvent(true);
      const tempArray = userData.tickets;
      tempArray.pop();
      await setDoc(doc(db,'users',user.uid),{inEvent: true, tickets:tempArray, selectedDinner: formattedOption},{merge:true});
    }, delay);
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={styles.screenContainer}>
      {/* Description */}
      {/* <Image 
        source={require('../../assets/logo_plates.png')} 
        style={styles.logoImage} 
        resizeMode="contain"
      /> */}
      {/* Date Buttons */}
      <View style={[styles.optionsContainer,{width: '90%',position: 'absolute', bottom: '2%'}]}>
        <Text style={[styles.title]}>{userData.shortSchool}</Text>
        <Text style={[styles.description]}>Select the date for a dinner with 3 students selected by our algorithm</Text>


        {nextWednesdays.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={() => setSelectedOption(option)}
          >
            <View style={styles.buttonContent}>
              <View style={styles.textContainer}>
                <Text style={styles.dateText}>{option.format('dddd, MMMM Do')}</Text>
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
          onPress={() => bookPressed()}
          disabled={!selectedOption}
        >
          <Text style={styles.bottomButtonText}>Book my seat</Text>
        </TouchableOpacity>
      </View>

      {/* Loading Modal */}
      <Modal
        visible={isFindingDinner}
        animationType="fade"
        transparent={true}
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.findingDinnerModal}>
            {!loadingComplete ? (
              <>
                <Progress.Circle
                  size={100} // Adjust the size as needed
                  indeterminate={true}
                  color={colors.primary}
                  borderWidth={3} // Adjust the thickness as needed
                />
                <Text style={styles.findingDinnerText}>Finding a Suitable Dinner</Text>
              </>
            ) : (
              <>
                <View style={styles.checkmarkContainer}>
                  <Text style={styles.checkmark}>✔</Text>
                </View>
                <Text style={styles.successText}>Dinner Found!</Text>
              </>
            )}
          </View>
        </View>
      </Modal>

      <PriceModal 
        isVisible={isModalVisible} 
        closeModal={closeModal} 
        onClose={closeModal} 
        selectedOption={selectedOption} 
        setSelectedOption={setSelectedOption} 
        PromptSubscribe={PromptSubscribe}
        PromptTicket={PromptTicket}
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
    width: '65%',
    height: '65%',
    position: 'absolute',
    flex: 1,
    top:-175,
  },
  // New styles for the loading modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  findingDinnerModal: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
  },
  findingDinnerText: {
    marginTop: 20,
    fontSize: 18,
    color: colors.black,
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
  },
});

export default HomeScreen;
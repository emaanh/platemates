import React,{useEffect,useState, useContext} from 'react';
import { createContext } from 'react';
import {
  Alert,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Ensure this is installed and linked
import IcebreakerScreen from './IcebreakerScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { colors } from '../../stylevars';
import { onSnapshot, doc, updateDoc, getDoc, setDoc, deleteDoc, getDocs, collection, serverTimestamp, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase-config';
import { AuthContext } from '../../AuthProvider';
import { useNavigation } from '@react-navigation/native';


const Stack = createStackNavigator();

function EventHub({toggleUserInEvent}){
  return (
    <Stack.Navigator screenOptions={{ gestureEnabled: false, swipeEnabled: false, headerShown: false  }}>
      <Stack.Screen
        name="EventHome"
        children={() => <EventHomeScreen toggleUserInEvent={toggleUserInEvent} />}
      />
      <Stack.Screen
        name="Icebreaker"
        component={IcebreakerScreen}
      />
    </Stack.Navigator>
  );
}


function EventHomeScreen({toggleUserInEvent}) {
  const [isGroupRevealed, setIsGroupRevealed] = useState(false);
  const [isRestaurantRevealed, setIsRestaurantRevealed] = useState(false);
  const [isDinnerHidden, setIsDinnerHidden] = useState(false);
  const [isIcebreakerRevealed, setIsIcebreakerRevealed] = useState(false);
  const [isFeedbackRevealed, setIsFeedbackRevealed] = useState(false);
  const [isSeatConfirmedHidden, setIsSeatConfirmedHidden] = useState(false);

  const [lateShown, setLateShown] = useState(false);

  const navigation = useNavigation();
  const { userData, user } = useContext(AuthContext);

  const [userList, setUserList] = useState([]);
  const [groupNames, setGroupNames] = useState([]);
  const [restaurantInfo, setRestaurantInfo] = useState([null,null]);
  const [isLateNotified, setIsLateNotified] = useState(false);
  const [inputHeight, setInputHeight] = useState(40);

  const [lateModal, setLateModal] = useState(false);
  const [lateMessage, setLateMessage] = useState('');

  const [late, setLate] = useState(false);


  const [dinnerTime, setDinnerTime] = useState('');

  useEffect(() => {
    let unsubscribe;
  
    const fetchEventDetails = async () => {
      if (userData && userData.eventID !== null) {
        const eventRef = doc(db, 'events', userData.eventID);
        
        unsubscribe = onSnapshot(eventRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            setLateShown(true);
            const eventData = docSnapshot.data();

            console.log('dinner',eventData.dinnerTime.toDate())
            setDinnerTime(eventData.dinnerTime.toDate());

            setIsGroupRevealed(eventData.isGroupRevealed);
            setIsRestaurantRevealed(eventData.isRestaurantRevealed);
            setIsDinnerHidden(eventData.isDinnerHidden);
            setIsIcebreakerRevealed(eventData.isIcebreakerRevealed);
            setIsFeedbackRevealed(eventData.isFeedbackRevealed);
            setIsSeatConfirmedHidden(eventData.isSeatConfirmedHidden);

            if (eventData.userList && Array.isArray(eventData.userList)) {
              setUserList(eventData.userList);

              const groupNames = eventData.userList
                .map(user => user.name)
                .filter(name => name !== userData.fullName);
              setGroupNames(groupNames);

              const currentUser = eventData.userList.find(user => user.name === userData.fullName);

              if (currentUser && currentUser.late === true) {
                setIsLateNotified(true);
              } else {
                setIsLateNotified(false);
              }
            } else {
              setUserList([]);
            }

            if (eventData.restaurantInfo) {
              setRestaurantInfo(eventData.restaurantInfo);
            } else {
              setRestaurantInfo([null, null]);
            }
          }
        });
      } else{
        setDinnerTime(new Date(userData.selectedDinner));
      }
    };
  
    fetchEventDetails();
  
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userData]);

  const handleLatePress = async () => {
    if (!isLateNotified) {
      alert('Everyone has been notified that you\'re late.');
      const updatedUserList = userList.map(userItem => {
        if (userItem.name === userData.fullName) {
          return { ...userItem, late: true };
        }
        return userItem;
      });
      await setDoc(doc(db, 'events', userData.eventID), { userList: updatedUserList }, { merge: true });

      setIsLateNotified(true);
    }
  };

  const handleCancelPress = () => {
    Alert.alert(
      "Cancel Event",
      "Are you sure you want to cancel? This action cannot be undone and tickets won't be refunded.",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: async () => {
            toggleUserInEvent(false);
            Alert.alert('You have been removed from this event.');
            await addDoc(collection(db, 'cancelNotice'), { name: userData.fullName, timestamp: serverTimestamp(), oldEventID: userData.eventID });
            await setDoc(doc(db, 'users', user.uid), { inEvent: false, eventID: null }, { merge: true });
          }
        }
      ],
      { cancelable: true }
    );
  };

  const handleToggleHeart = async(index) => {
    const newList = [...userList];
    newList[index].liked = !newList[index].liked;
    setUserList(newList);
    await setDoc(doc(db,'events',userData.eventID),{userList:newList},{merge:true});
  };

  const handleExitEvent = async () => {
    Alert.alert(
      "Confirm Exit", 
      "Are you sure you want to exit the event? You can review an archive in Bookings", 
      [
        {
          text: "Cancel",
          onPress: () => console.log("Exit canceled"),
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: async () => {
            // Logic for exiting the event
            await setDoc(
              doc(db, 'users', user.uid), 
              { eventID: null, inEvent: false, selectedDinner: null }, 
              { merge: true }
            );
            toggleUserInEvent(false);
          }
        }
      ],
      { cancelable: true }
    );
  };

  const handleIcebreakerPress = () => {
    navigation.navigate('Icebreaker');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Dinner Scheduled</Text>

      <View style={styles.divider} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Icebreaker Game as a Pressable Button */}
        {isIcebreakerRevealed && <TouchableOpacity style={[styles.bubbleIceBreaker, {backgroundColor: colors.ice, borderColor: colors.black,}]} onPress={handleIcebreakerPress}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Icebreaker Game</Text>
            <Icon name="arrow-forward" size={24} color={colors.black} style={styles.arrowIcon} />
          </View>
        </TouchableOpacity>}

        {/* Existing Content */}
        {!isSeatConfirmedHidden && <View style={[styles.bubble, { backgroundColor: colors.primary, borderWidth: 0 }]}>
          <Text style={[styles.bubbleText, { color: colors.background }]}>Your seat is confirmed</Text>

          <View style={styles.dateTimeContainer}>
            <Icon name="calendar-today" size={20} color={colors.background} style={styles.icon} />
            <Text style={[styles.dateTimeText, { color: colors.background }]}>
              {dinnerTime
                ? dinnerTime.toLocaleString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })
                : 'Loading...'}
            </Text>
          </View>

          <View style={[styles.separator, { backgroundColor: colors.background }]} />

          <View style={styles.locationContainer}>
            <Icon name="location-on" size={20} color={colors.background} style={styles.icon} />
            <Text style={[styles.locationText, { color: colors.background }]}>{userData.shortSchool}</Text>
          </View>

          <View style={styles.buttonContainer}>
          {lateShown &&
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary, borderColor: colors.background, borderWidth: 1 }]}
            onPress={() => {
              if(userData.eventID === null){
                Alert.alert('This feature is not available yet');
                return;
              }
              if(isLateNotified){
                Alert.alert('This action cannot be reversed');
                return;
              }
              setLateModal(true)
            }}
          >
            <Text style={[styles.buttonText, { fontFamily: 'Poppins_700Bold', color: colors.background }]}>
              {isLateNotified ? 'Dinner members notified' : 'I will be late'}
            </Text>
          </TouchableOpacity>}

            {/* <View style={styles.shadowContainer}>
              <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary, borderColor: colors.background, borderWidth: 1 }]}>
                <Text style={[styles.buttonText, { fontFamily: 'Poppins_700Bold', color: colors.background}]}>
                  Reschedule
                </Text>
              </TouchableOpacity>
            </View> */}

            <View style={{}}>
              <TouchableOpacity onPress={handleCancelPress} style={[{ backgroundColor: colors.primary, marginTop: 10, alignSelf: 'center', borderWidth: 0 }]}>
                <Text style={[styles.buttonText, { textDecorationStyle: 'solid', fontFamily: 'Poppins_700Bold', color: colors.background }]}>
                  Cancel
                </Text>
                {/* <View style={{height: 0.6,backgroundColor: colors.white, borderRadius: 1, }} /> */}
              </TouchableOpacity>
            </View>
          </View>
        </View>}

        <Modal
          animationType="slide"
          transparent={true}
          visible={lateModal}
          onRequestClose={() => {
            setLateModal(!lateModal);
          }}
        >
          <View style={styles.modalContainer}>
            <Text style={[styles.LateModalTitleText, {marginTop: 0}]}>Life Happens,</Text>

            <Text style={styles.LateModalTitleText}>We'll let your plate-mates know! </Text>

            <View style={styles.modalView}>
              <TextInput
                style={styles.textInput}
                multiline={true}
                onChangeText={setLateMessage}
                value={lateMessage}
                onContentSizeChange={(event) => {
                  setInputHeight(event.nativeEvent.contentSize.height);
                }}
                placeholder="Leave a Message for your Group (Optional)"
                placeholderTextColor = {colors.grey}
              />

              <View style={styles.shadowContainer}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: colors.primary, borderWidth: 0 }]}
                  onPress={async() => {
                    const updatedUserList = userList.map(userItem => {
                      if (userItem.name === userData.fullName) {
                        return { ...userItem, late: true, lateMessage };
                      }
                      return userItem;
                    });
                    await setDoc(doc(db, 'events', userData.eventID), { userList: updatedUserList }, { merge: true });
                    setLateModal(false);
                    setIsLateNotified(true);
                    Alert.alert('Everyone has been notified that you\'re late.');
                  }}
                >
                  <Text style={[styles.buttonText, {fontFamily: 'Poppins_700Bold', color: colors.white}]}>Confirm You'll be Late</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.shadowContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setLateModal(!lateModal)}
                >
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <View style={styles.bubble}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Your Restaurant</Text>
          </View>
          {isRestaurantRevealed ? (
            <View>
              <Text style={[styles.restaurantAddress, {marginTop: 5}]}>{restaurantInfo[0]}</Text>
              <Text style={styles.restaurantAddress}>{restaurantInfo[1]}</Text>
            </View>
          ) : (
            <View>
              <Text style={styles.bubbleHeader}>Your restaurant will be revealed on</Text>
              <Text style={[styles.bubbleHeader, { fontFamily: 'Poppins_700Bold', marginTop: 0, color: colors.primary }]}>
                {(() => {
                  if(dinnerTime === ''){
                    return;
                  }
                  const previousDay = new Date(dinnerTime);
                  previousDay.setDate(dinnerTime.getDate() - 1); // Subtract one day
                  previousDay.setHours(12, 0, 0, 0); // Set time to 17:00

                  return previousDay.toLocaleString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  });
                })()}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.bubble}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Your Group</Text>
          </View>
          {isGroupRevealed ? (
            <View>
              {userList.map((userItem, index) => (
                <Text key={index} style={{fontSize: 20, marginTop: 5, marginLeft: 10, fontFamily: 'Poppins_400Regular'}}>
                  - {userItem.name} {userItem.late ? (userItem.lateMessage ? ' ('+userItem.lateMessage+')' : '(Late)') : ''}
                </Text>
              ))}
            </View>
          ) : (
            <View>
              <Text style={styles.bubbleHeader}>Find out more about your group on</Text>
              <Text style={[styles.bubbleHeader, { fontFamily: 'Poppins_700Bold', marginTop: 0, color: colors.primary }]}>
                {(() => {
                  if(dinnerTime === ''){
                    return;
                  }
                  const previousDay = new Date(dinnerTime);
                  previousDay.setDate(dinnerTime.getDate() - 1); // Subtract one day
                  previousDay.setHours(17, 0, 0, 0); // Set time to 17:00

                  return previousDay.toLocaleString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  });
                })()}
              </Text>
            </View>
          )}
        </View>

        {!isDinnerHidden && <View style={styles.bubble}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Your Dinner</Text>
          </View>
          <Text style={styles.bubbleHeader}>The icebreaker game will be available at</Text>
          <Text style={[styles.bubbleHeader, { fontFamily: 'Poppins_700Bold', marginTop: 0, color: colors.primary }]}>
            {dinnerTime && new Date(dinnerTime.setHours(19, 0, 0, 0)).toLocaleString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })}
          </Text>
        </View>}
        

        {isFeedbackRevealed && (
          <View style={styles.bubble}>
            <View style={styles.titleContainer}>
              <Text style={[styles.titleText, {marginBottom: 10}]}>Rate your Dinner Mates</Text>
            </View>
            {userList.map((person, index) => (
              <View key={index} style={styles.feedbackItem}>
                <Text style={styles.feedbackName}>{person.name}</Text>
                <TouchableOpacity onPress={() => handleToggleHeart(index)}>
                  <Icon
                    name={person.liked ? 'favorite' : 'favorite-border'}
                    size={28}
                    color={person.liked ? colors.red : colors.grey}
                  />
                </TouchableOpacity>
              </View>
            ))}
            <View style={[styles.shadowContainer,{marginTop: 10}]}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.red, borderColor: colors.background }]}
                onPress={() => handleExitEvent()}  // Replace with actual function
              >
                <Text style={[styles.buttonText, { fontFamily: 'Poppins_700Bold', color: colors.background }]}>
                  Exit Event
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={{fontSize: 15, textAlign: 'center', marginTop: 10, fontFamily: 'Poppins_400Regular', color: colors.grey}}>*If you had any issues with your dinner, call 650-282-0663 for compensation.</Text>
          </View>
        )}

        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.black,
    marginVertical: 10,
    alignSelf: 'center',
    fontFamily: 'LibreBaskerville_700Bold',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  bubble: {
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginVertical: 10,
    backgroundColor: 'transparent',
    marginHorizontal: 10,
  },
  bubbleIceBreaker: {
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginVertical: 10,
    backgroundColor: 'transparent',
    marginHorizontal: 10,
  },
  bubbleText: {
    color: colors.black,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    fontFamily: 'Poppins_700Bold',
    marginLeft: 10,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  dateTimeText: {
    color: colors.black,
    fontSize: 16,
    marginLeft: 5,
    fontFamily: 'Poppins_400Regular',
  },
  icon: {
    // Adjust icon styles if needed
  },
  separator: {
    width: '99%',
    height: 1,
    backgroundColor: colors.black,
    marginVertical: 15,
    alignSelf: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
    marginLeft: 10,
  },
  locationText: {
    color: colors.black,
    fontSize: 18,
    marginLeft: 5,
    fontFamily: 'Poppins_400Regular',
  },
  buttonContainer: {
    marginTop: 10, // Adjusted from 20 to 10 for better spacing
    width: '100%',
  },
  button: {
    backgroundColor: 'transparent',
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 5,
    borderWidth: 2,
    borderColor: colors.black,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins_400Regular',
  },
  shadowContainer: {
    borderRadius: 10,
    padding: 2,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,

    elevation: 5,
  },
  bubbleHeader: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginLeft: 10,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'left',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
    justifyContent: 'space-between', // Ensure space between title and arrow
  },
  titleText: {
    color: colors.black,
    fontSize: 22,
    marginLeft: 5,
    fontFamily: 'Poppins_700Bold',
  },
  arrowIcon: {
    marginRight: 5,
  },
  divider: {
    height: 0.5, // Thin line
    width: '110%',
    alignSelf: 'center',
    backgroundColor: colors.grey,
    marginHorizontal: 20,
  },
  groupText: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: colors.black,
    marginLeft: 10,
  },
  restaurantName: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: colors.primary,
    marginLeft: 10,
  },
  restaurantAddress: {
    fontSize: 19,
    fontFamily: 'Poppins_400Regular',
    color: colors.black,
    marginLeft: 10,
  },
  feedbackItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    marginLeft: 10,
  },
  feedbackName: {
    fontSize: 18,
    fontFamily: 'Poppins_400Regular',
    color: colors.black,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    paddingTop: 40, // Add padding to move everything down
    justifyContent: 'center', // Center content vertically
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  textInput: {
    fontFamily: 'Poppins_400Regular',
    width: '100%',
    borderColor: colors.black,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 15
  },
  LateModalTitleText: {
    fontSize: 20,
    color: colors.black,
    textAlign: 'center',
    fontWeight: 'bold',
    marginVertical: 20,
    fontFamily: 'LibreBaskerville_700Bold',
  }
});

export default EventHub;
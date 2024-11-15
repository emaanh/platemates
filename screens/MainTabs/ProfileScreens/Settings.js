// Settings.js
import React, { useContext, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
  ScrollView,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { AuthContext } from '../../../AuthProvider';
import { deleteUser } from 'firebase/auth';
import { doc, collection, updateDoc,getDocs, writeBatch, deleteDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebase-config';
import { colors } from '../../../stylevars';
import * as Haptics from 'expo-haptics';

function Settings({ navigation }) {
  const { userData, user, signOut, subscriptionType, subscribed, clearUser } = useContext(AuthContext);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(
    userData.receiveNotifications
  );
  const [isSMSAlertsEnabled, setIsSMSAlertsEnabled] = useState(userData.receiveSMS);
  const [subscriptionStatus, setSubscriptionStatus] = useState(userData.subscriptionStatus); // Add subscription status

  const openPrivacyPolicy = async () => {
    const url = 'https://www.platemates.app/privacy';
    // Check if the link can be opened
    const supported = await Linking.canOpenURL(url);
  
    if (supported) {
      // Open the link with the default browser
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  };

  const toggleNotifications = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newValue = !isNotificationsEnabled;
    setIsNotificationsEnabled(newValue);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        receiveNotifications: newValue,
      });
    } catch (error) {
      console.error('Error updating notifications:', error);
      setIsNotificationsEnabled(isNotificationsEnabled);
      Alert.alert('Error', 'Failed to update notification settings.');
    }
  };

  const toggleSMSAlerts = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newValue = !isSMSAlertsEnabled;
    setIsSMSAlertsEnabled(newValue);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        receiveSMS: newValue,
      });
    } catch (error) {
      console.error('Error updating SMS alerts:', error);
      setIsSMSAlertsEnabled(isSMSAlertsEnabled);
      Alert.alert('Error', 'Failed to update SMS alert settings.');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            await signOut();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const deleteSubCollection = async (userDocRef, subCollectionName) => {
    const subCollectionRef = collection(userDocRef, subCollectionName);
    const snapshot = await getDocs(subCollectionRef);
    
    if (snapshot.empty) {
      console.log(`No documents found in ${subCollectionName} sub-collection.`);
      return;
    }
  
    const batch = writeBatch(db);
    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
  
    try {
      await batch.commit();
      console.log(`Successfully deleted all documents in ${subCollectionName} sub-collection.`);
    } catch (error) {
      console.error(`Error deleting documents in ${subCollectionName} sub-collection:`, error);
      throw error; // Propagate error to handle it in the calling function
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Confirm Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            if (user) {
              deleteUser(user)
                .then(async () => {
                  clearUser();
                  const userDocRef = doc(db, 'users', user.uid);
                  await setDoc(doc(db,'deleteAccount', user.uid),{uid:user.uid, email: userData.email, timestamp:serverTimestamp()})
                  await deleteSubCollection(userDocRef, 'events');
                  await deleteSubCollection(userDocRef, 'notifications');
                  await deleteDoc(userDocRef);
                })
                .catch((error) => {
                  Alert.alert('Account deletion requires recent authentication! Please log out, login, and try again.');
                });
            } else {
              console.log('No user is signed in');
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  const subscriptionMap = {
    month1: '1 Month',
    month3: '3 Months',
    month6: '6 Months',
  };
  
  const renderSubscriptionStatus = () => {
    if (!subscribed && userData.tickets.length > 0) {
      const ticketCount = userData.tickets.length;
      const ticketText = ticketCount === 1 ? '1 ticket' : `${ticketCount} tickets`;
      return ticketText;
    } else if (subscribed) {
      const subscriptionDisplay = subscriptionType || 'Unknown Subscription';
      return `${subscriptionDisplay} subscription`;
    }
    return 'No active subscription';
  };

  return (
    <View style={styles.screenContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            navigation.goBack();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Feather name="arrow-left" size={30} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* Settings Options */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        
        {/* Subscription Status */}
        <View style={[styles.subscribeContainer, {textAlign: 'center',height: 100}]}>
          <View style={[styles.optionLeft,{alignSelf: 'center'}]}>
            <Text style={[styles.optionText,{marginLeft: 5, marginTop: -5}]}>Subscription Status</Text>
          </View>
          <Text style={styles.subscriptionText}>
            {renderSubscriptionStatus()}
          </Text>
        </View>

        {/* Notifications Option */}
        <View style={styles.optionContainer}>
          <View style={styles.optionLeft}>
            <Feather name="bell" size={24} color={colors.black} />
            <Text style={styles.optionText}>Notifications</Text>
          </View>
          <Switch
            trackColor={{ false: colors.disabled_toggle, true: colors.primary }}
            thumbColor={isNotificationsEnabled ? colors.white : colors.white}
            ios_backgroundColor={colors.ios_backgroundColor}
            onValueChange={toggleNotifications}
            value={isNotificationsEnabled}
          />
        </View>

        {/* Receive SMS Alerts Option */}
        <View style={styles.optionContainer}>
          <View style={styles.optionLeft}>
            <Feather name="message-square" size={24} color={colors.black} />
            <Text style={styles.optionText}>Receive SMS Alerts</Text>
          </View>
          <Switch
            trackColor={{ false: colors.disabled_toggle, true: colors.primary }}
            thumbColor={isSMSAlertsEnabled ? colors.white : colors.white}
            ios_backgroundColor={colors.ios_backgroundColor}
            onValueChange={toggleSMSAlerts}
            value={isSMSAlertsEnabled}
          />
        </View>

        {/* EULA Option */}
        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);navigation.navigate('EULA');}}
        >
          <View style={styles.optionLeft}>
            <Feather name="file-text" size={24} color={colors.black} />
            <Text style={styles.optionText}>EULA</Text>
          </View>
          <Feather name="chevron-right" size={24} color="#555" />
        </TouchableOpacity>

        {/* Terms and Conditions Option */}
        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => {Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);navigation.navigate('TermsAndConditions')}}
        >
          <View style={styles.optionLeft}>
            <Feather name="info" size={24} color={colors.black} />
            <Text style={styles.optionText}>Terms and Conditions</Text>
          </View>
          <Feather name="chevron-right" size={24} color="#555" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => {Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);openPrivacyPolicy()}}
        >
          <View style={styles.optionLeft}>
            <Feather name="shield" size={24} color={colors.black} />
            <Text style={styles.optionText}>Privacy Policy</Text>
          </View>
          <Feather name="chevron-right" size={24} color="#555" />
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.optionContainer, styles.logoutButton]}
          onPress={() => {Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);handleLogout()}}
        >
          <View style={styles.optionLeft}>
            <Feather name="log-out" size={24} color="#FF3B30" />
            <Text style={[styles.optionText, styles.logoutText]}>Logout</Text>
          </View>
          <Feather name="chevron-right" size={24} color="#FF3B30" />
        </TouchableOpacity>

        {/* Delete Account Button */}
        <TouchableOpacity
          style={styles.deleteAccountButton}
          onPress={handleDeleteAccount}
        >
          <Text style={styles.deleteAccountText}>Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 65,
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    alignSelf: 'center',
    color: colors.black,
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'LibreBaskerville_700Bold',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderColor: colors.black,
    borderWidth: 1,
  },
  subscribeContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderColor: colors.black,
    borderWidth: 1,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    color: colors.black,
    fontSize: 16,
    marginLeft: 15,
    fontFamily: 'Poppins_400Regular',
  },
  subscriptionText: {
    top: -10,
    color: colors.primary,
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
  },
  logoutButton: {
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: '#FF3B30',
  },
  logoutText: {
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  deleteAccountButton: {
    marginTop: 5,
    alignItems: 'center',
  },
  deleteAccountText: {
    color: '#FF3B30',
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
});

export default Settings;
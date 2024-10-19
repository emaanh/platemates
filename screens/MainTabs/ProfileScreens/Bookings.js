import React, { useState, useEffect, useContext } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { AuthContext } from '../../../AuthProvider';
import { db } from '../../../firebase/firebase-config';
import { createStackNavigator } from '@react-navigation/stack';
import {
  collection,
  query,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';
import { colors } from '../../../stylevars';
import BookingSnap from './BookingSnap';

const Stack = createStackNavigator();

function BookingsHub() {

  return (
    <Stack.Navigator screenOptions={{ swipeEnabled: false, headerShown: false  }}>
      <Stack.Screen
        name="BookingsList"
        component={Bookings}
      />
      <Stack.Screen
        name="BookingSnap"
        component={BookingSnap}
      />
    </Stack.Navigator>
  );
}

function Bookings({ navigation }) {
  const { user, bookings } = useContext(AuthContext);


  const renderBookingItem = ({ item }) => (
    <TouchableOpacity style={styles.bookingItem} onPress={() => {
      navigation.navigate('BookingSnap',{eventID: item.eventID});
    }}>
      <Feather name="calendar" size={24} color={colors.primary} />
      <View style={styles.bookingDetails}>
        <Text style={styles.bookingDate}>{item.date}</Text>
        <Text style={styles.bookingTime}>{item.time}</Text>
        <Text style={styles.bookingLocation}>{item.location}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screenContainer}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={30} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bookings</Text>
      </View>

      {/* Bookings List */}
      {bookings.length > 0 ? (
        <FlatList
          data={bookings}
          renderItem={renderBookingItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Feather name="calendar" size={100} color="#555" />
          <Text style={styles.emptyText}>No Dinner Yet</Text>
          {/* <TouchableOpacity
            style={styles.bookButton}
            onPress={() => {
              navigation.navigate('')
            }}
          >
            <Text style={styles.bookButtonText}>Book my Seat</Text>
          </TouchableOpacity> */}
        </View>
      )}
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
    borderBottomColor: colors.background,
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
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  bookingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.black
  },
  bookingDetails: {},
  bookingDate: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 15,
    fontFamily: 'Poppins_400Regular',
  },
  bookingTime: {
    color: colors.dark_grey,
    fontSize: 14,
    marginLeft: 15,
    fontFamily: 'Poppins_400Regular',
  },
  bookingLocation: {
    color: colors.dark_grey,
    fontSize: 14,
    marginLeft: 15,
    fontFamily: 'Poppins_400Regular',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#555',
    fontSize: 20,
    marginTop: 20,
    marginBottom: 30,
  },
  bookButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  bookButtonText: {
    color: colors.black,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.black,
    fontSize: 16,
    marginTop: 10,
  },
  lateText: {
    color: colors.red,
    fontFamily: 'Poppins_400Regular',
    fontSize: 20,
    right: '-100%',
    bottom: 2
  },
});

export default BookingsHub;
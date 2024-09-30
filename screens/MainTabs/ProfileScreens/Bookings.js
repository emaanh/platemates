import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

function Bookings({ navigation }) {
  // Sample data for bookings
  const [bookings, setBookings] = useState([
    {
      id: '1',
      date: '2024-10-15',
      time: '7:00 PM',
      location: 'The Grand Dinner Hall',
    },
  ]);

  const renderBookingItem = ({ item }) => (
    <View style={styles.bookingItem}>
      <Feather name="calendar" size={24} color="#E83F10" />
      <View style={styles.bookingDetails}>
        <Text style={styles.bookingDate}>{item.date}</Text>
        <Text style={styles.bookingTime}>{item.time}</Text>
        <Text style={styles.bookingLocation}>{item.location}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.screenContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={30} color="#E83F10" />
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
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => navigation.navigate('BookingScreen')} // Replace with your booking screen route
          >
            <Text style={styles.bookButtonText}>Book my Seat</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 55,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#000000',
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold'
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  bookingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
  },
  bookingDetails: {
  },
  bookingDate: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 15,
    fontFamily: 'Poppins_400Regular'
  },
  bookingTime: {
    color: '#cccccc',
    fontSize: 14,
    marginLeft: 15,
    fontFamily: 'Poppins_400Regular'
  },
  bookingLocation: {
    color: '#cccccc',
    fontSize: 14,
    marginLeft: 15,
    fontFamily: 'Poppins_400Regular'
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
    backgroundColor: '#E83F10',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Bookings;
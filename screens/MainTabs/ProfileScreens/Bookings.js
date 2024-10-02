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
import {
  collection,
  query,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';

function Bookings({ navigation }) {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    let unsubscribe;

    if (user && user.uid) {
      const eventsRef = collection(db, 'users', user.uid, 'events');

      // Create a query to order events by timestamp
      const eventsQuery = query(eventsRef, orderBy('timestamp', 'desc'));

      // Set up real-time listener
      unsubscribe = onSnapshot(
        eventsQuery,
        (querySnapshot) => {
          const bookingsList = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            const timestamp = data.timestamp;

            // Convert Firestore Timestamp to JavaScript Date object
            const date = timestamp.toDate();

            // Format date to 'yyyy-mm-dd' and time to 'HH:MM AM/PM'
            const formattedDate = date.toISOString().split('T')[0];
            const options = { hour: 'numeric', minute: 'numeric', hour12: true };
            const formattedTime = date.toLocaleTimeString('en-US', options);

            bookingsList.push({
              id: doc.id,
              date: formattedDate,
              time: formattedTime,
              location: data.title || 'No location specified',
            });
          });
          setBookings(bookingsList);
          setLoading(false); // Data loaded
        },
        (error) => {
          console.error('Error fetching bookings:', error);
          setLoading(false); // Stop loading on error
        }
      );
    } else {
      setLoading(false); // Stop loading if user is not available
    }

    // Cleanup on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

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

  if (loading) {
    // Show loading indicator
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E83F10" />
        <Text style={styles.loadingText}>Loading bookings...</Text>
      </View>
    );
  }

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
            onPress={() => {
              navigation.navigate('BookingScreen');
              
            }}
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
    fontFamily: 'Poppins_700Bold',
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
  bookingDetails: {},
  bookingDate: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 15,
    fontFamily: 'Poppins_400Regular',
  },
  bookingTime: {
    color: '#cccccc',
    fontSize: 14,
    marginLeft: 15,
    fontFamily: 'Poppins_400Regular',
  },
  bookingLocation: {
    color: '#cccccc',
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
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#E83F10',
    fontSize: 16,
    marginTop: 10,
  },
});

export default Bookings;
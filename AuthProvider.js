import React, { createContext, useState, useEffect } from 'react';
import { authentication } from './firebase/firebase-config'; // Adjust the import path to your firebase config
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot, query, orderBy, collection } from 'firebase/firestore';
import { db } from './firebase/firebase-config';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true); // New state for bookings loading
  const [loaded, setLoaded] = useState(false); // Authentication loading

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authentication, (user) => {
      setUser(user);
      setLoaded(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let unsubscribe;

    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          setUser(null);
          setUserData(null);
        }
      });
    } else {
      setUserData(null);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  useEffect(() => {
    let unsubscribe;

    if (user) {
      const notificationsRef = collection(db, 'users', user.uid, 'notifications'); // Ensure the collection reference is correct
      const notificationsQuery = query(
        notificationsRef,
        orderBy('timestamp', 'desc')
      );

      unsubscribe = onSnapshot(
        notificationsQuery,
        (querySnapshot) => {
          const notificationsList = [];
          querySnapshot.forEach((doc) => {
            notificationsList.push({
              id: doc.id,
              title: doc.get('message'),
              timestamp: doc.get('timestamp'),
            });
          });
          console.log(notificationsList);
          setNotifications(notificationsList);
        },
        (error) => {
          console.error('Error fetching notifications:', error);
        }
      );
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  const getDateFromTimestamp = (timestamp) => {
    if (!timestamp) return new Date();
    return timestamp.toDate ? timestamp.toDate() : timestamp;
  };

  useEffect(() => {
    let unsubscribe;

    if (user) {
      const eventsRef = collection(db, 'users', user.uid, 'events'); // Ensure the collection reference is correct
      const eventsQuery = query(eventsRef); // Add more query filters if needed

      unsubscribe = onSnapshot(
        eventsQuery,
        (querySnapshot) => {
          const bookingsList = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            const timestamp = data.timestamp;

            // Convert Firestore Timestamp to JavaScript Date object
            const date = getDateFromTimestamp(timestamp);

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

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  const handleSignOut = () => {
    signOut(authentication)
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  return (
    <AuthContext.Provider value={{ 
      userData, 
      user, 
      notifications, 
      bookings, 
      signOut: handleSignOut, 
      authLoaded: loaded, 
      bookingsLoading: loading // Exposing loading state
    }}>
      {children}
    </AuthContext.Provider>
  );
};
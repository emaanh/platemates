import React, { createContext, useState, useEffect } from 'react';
import { authentication } from './firebase/firebase-config'; // Adjust the import path to your firebase config
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { getDocs, doc, setDoc, onSnapshot, query, orderBy, collection, where, limit, serverTimestamp, Timestamp, addDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase/firebase-config';
import { Alert } from 'react-native';
import {initConnection, getProducts, getAvailablePurchases, endConnection, getPurchaseHistory} from 'react-native-iap';
import { sendSignInLinkToEmail, signInWithEmailLink } from 'firebase/auth';
import * as Application from 'expo-application';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true); // New state for bookings loading
  const [loaded, setLoaded] = useState(false); // Authentication loading
  const [subscribed, setSubscribed] = useState(false); // Track subscription products
  const [hasTicket, setHasTicket] = useState(false);
  const [caller, setCaller] = useState(false);
  const [subscriptionType, setSubscriptionType] = useState(null);
  const [schools, setSchools] = useState([]);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [deviceID, setDeviceID] = useState('');

  
  useEffect(() => {
    const schoolsRef = collection(db, 'schools');
  
    const unsubscribe = onSnapshot(schoolsRef, (snapshot) => {
      const schoolsList = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        const info = data.info;
        schoolsList.push(info); // Creates an array with a nested array from info
      });
      setSchools(schoolsList);
    }, (error) => {
      console.error('Error fetching schools:', error);
    });
  
    return () => {
      unsubscribe();
    };
  }, []);



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
      unsubscribe = onSnapshot(userDocRef, async(docSnap) => {
        if (docSnap.exists()) {
          setUserData(docSnap.data());
          if (docSnap && docSnap.get('tickets') && docSnap.get('tickets').length > 0){
            setHasTicket(true);
          } else{
            setHasTicket(false);
          }
        } else {
          // setUser(null);
          // setUserData(null);
          // await handleSignOut();
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
      const purchaseRef = collection(db, 'users', user.uid, 'purchases');
      const purchasesQuery = query(
        purchaseRef,
        where('isTicket', '==', false),
        orderBy('IAPTimestamp', 'desc'),
        limit(1)
      );
  
      unsubscribe = onSnapshot(purchasesQuery,(querySnapshot) => {
          if(querySnapshot.docs.length === 0){
            setSubscribed(false);
            setSubscriptionType('');
          }

          querySnapshot.forEach(async(doc) => {
            const docData = doc.data();
    
            const purchaseType = docData.purchase;
            const IAPTimestamp = docData.IAPTimestamp;
            const purchaseDate = IAPTimestamp.toDate();

  
            let months = 0;
            if (purchaseType === '1 Month') {
              months = 1;
            } else if (purchaseType === '3 Months') {
              months = 3;
            } else if (purchaseType === '6 Months') {
              months = 6;
            } else {
              console.error('Unrecognized purchase type:', purchaseType);
              return;
            }
  
            const expirationDate = new Date(purchaseDate);
            expirationDate.setMonth(expirationDate.getMonth() + months);
  
            const currentDate = Timestamp.now().toDate();
            if (currentDate > expirationDate) {
              const filteredTransactions = transactionHistory.filter(
                (transaction) => transaction.productId !== '1time'
              );

              if (filteredTransactions.length > 0) {
                const sortedTransactions = filteredTransactions.sort(
                  (a, b) => new Date(b.transactionDate) - new Date(a.transactionDate)
                );

                const mostRecentTransaction = sortedTransactions[0];
            
                let thresholdMonths;
                let subName;
                switch (mostRecentTransaction.productId) {
                  case 'month1':
                    thresholdMonths = 1;
                    subName = '1 Month';
                    break;
                  case 'month3':
                    thresholdMonths = 3;
                    subName = '3 Months';
                    break;
                  case 'month6':
                    thresholdMonths = 6;
                    subName = '6 Months';
                    break;
                  default:
                    subName = '0 Months';
                    thresholdMonths = 0; // Handle unexpected productIds
                }
                const transactionDate = new Date(mostRecentTransaction.transactionDate);

                const renewalDate = new Date(transactionDate);
                renewalDate.setMonth(renewalDate.getMonth() + thresholdMonths);
            
                if (currentDate < renewalDate) {
                  await addDoc(collection(db, 'users', user.uid, 'purchases'), {
                    isTicket: false,
                    purchase: subName,
                    serverTimestamp: serverTimestamp(),
                    IAPTimestamp: Timestamp.fromMillis(parseInt(mostRecentTransaction.transactionDate)),
                    receipt: mostRecentTransaction.transactionReceipt,
                    transactionID: mostRecentTransaction.transactionId,
                  });
                } else {
                  setSubscribed(false);
                  setSubscriptionType('');
                  // Alert.alert('Need to renew subscription.');
                }

              } else {
                setSubscribed(false);
                setSubscriptionType('');
                console.log('No eligible transactions found for renewal.');
              }
            

            } else {
              setSubscribed(true);
              setSubscriptionType(purchaseType);
            }
          });
        },
      );
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user, transactionHistory]);


  const productSkus = ['1time', 'month1', 'month3', 'month6', 'singleticketpromo'];
  useEffect(() => {
    handleGetProducts();
  }, []);

  const handleGetProducts = async () => {
    try {
      await initConnection();
      const productResults = await getProducts({ skus: productSkus });
      const history = await getPurchaseHistory();
      setTransactionHistory(history);
    } catch (error) {
      console.log({ message: 'handleGetProducts', error });
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      const uniqueId = await Application.getIosIdForVendorAsync();
      setDeviceID(uniqueId);
      const docSnap = await getDoc(doc(db, 'analytics', uniqueId));
      if(!docSnap.exists()){
        await setDoc(doc(db,'analytics',uniqueId),{installed: true, timestamp: serverTimestamp()},{merge:true});
      }
    };
    fetchData();
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
              description: doc.get('description')
            });
          });
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
              eventID: data.eventID
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

  const clearUser = () => {
    setUser(null);
    setUserData(null);
  };

  return (
    <AuthContext.Provider value={{ 
      userData, 
      user, 
      notifications, 
      bookings, 
      signOut: handleSignOut, 
      authLoaded: loaded, 
      bookingsLoading: loading, // Exposing loading state
      subscribed,
      caller,
      setCaller,
      hasTicket,
      subscriptionType,
      setUser,
      clearUser,
      schools,
      deviceID
    }}>
      {children}
    </AuthContext.Provider>
  );
};
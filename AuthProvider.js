import React, { createContext, useState, useEffect } from 'react';
import { authentication } from './firebase/firebase-config'; // Adjust the import path to your firebase config
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase/firebase-config';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loaded, setLoaded] = useState(false);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authentication, (user) => {
      setUser(user);
      setLoaded(true);
    });

    return () => unsubscribe();
  }, []);

  // Set up a snapshot listener for the user's data
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
    <AuthContext.Provider value={{ userData, user, signOut: handleSignOut, authLoaded: loaded }}>
      {children}
    </AuthContext.Provider>
  );
};
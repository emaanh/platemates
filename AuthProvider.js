import React, { createContext, useState, useEffect } from 'react';
import { authentication } from './firebase/firebase-config'; // Adjust the import path to your firebase config
import { onAuthStateChanged, signOut } from 'firebase/auth';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authentication, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoaded(true);
    });

    return () => unsubscribe();
  }, []);

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
    <AuthContext.Provider value={{ user, signOut: handleSignOut, authLoaded: loaded }}>
      {children}
    </AuthContext.Provider>
  );
};

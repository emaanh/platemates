import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyBi-ssni1HrNarI-U-GGIjXo_KcHmDWNtw",
  authDomain: "platemates-3ec37.firebaseapp.com",
  projectId: "platemates-3ec37",
  storageBucket: "platemates-3ec37.appspot.com",
  messagingSenderId: "970420223223",
  appId: "1:970420223223:web:1fdac5f8c9a256c958a7f2",
  measurementId: "G-970HRSRE2V"
};

const app = initializeApp(firebaseConfig);

let authentication;
if (Platform.OS === 'web') {
  authentication = getAuth(app);
} else {
  authentication = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
}

export const db = getFirestore(app);
export const storage = getStorage(app, 'gs://consentapp-11721.appspot.com');


export { authentication };
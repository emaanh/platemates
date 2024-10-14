import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { db } from './firebase/firebase-config';
import LandingPage from './screens/LandingPage';
import { AuthProvider } from './AuthProvider';
import { NavigationContainer } from '@react-navigation/native';
import SelectSchool from './screens/SelectSchool';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import PersonalityQuiz from './screens/PersonalityQuiz';
import QuizResults from './screens/QuizResults';
import PhoneNumber from './screens/PhoneNumber';
import EmailPassword from './screens/EmailPassword';
import MainPage from './screens/MainPage';
import { colors } from './stylevars';
import QuotePage from './screens/QuotePage';
import LoginScreen from './screens/LoginScreen';
import { useEffect,useContext, useState } from 'react';
import { AuthContext } from './AuthProvider';
import { LibreBaskerville_400Regular, LibreBaskerville_700Bold } from '@expo-google-fonts/libre-baskerville';
import { withIAPContext } from 'react-native-iap';
import GoogleInfo from './screens/GoogleInfo';
import * as Linking from 'expo-linking';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { authentication } from './firebase/firebase-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setDoc, doc } from 'firebase/firestore';
import messaging from '@react-native-firebase/messaging';

const Stack = createStackNavigator();


function App() {
  const [fcmToken, setFcmToken] = useState('');

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
    

    return unsubscribe;
  }, []);

  useEffect(() => {
    // Function to request permission and get the token
    const requestPermissionAndGetToken = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
      if (enabled) {
        console.log('Authorization status:', authStatus);
        // Get the FCM token
        const token = await messaging().getToken();
        console.log('FCM Token:', token);
        setFcmToken(token);
  
        // Optionally, send the token to your server for later use
        // await sendTokenToServer(token);
      } else {
        Alert.alert('Permission denied', 'Unable to get notification permissions.');
      }
    };
  
    requestPermissionAndGetToken();
  
    // Listen for token refresh
    const unsubscribeTokenRefresh = messaging().onTokenRefresh(token => {
      console.log('FCM Token refreshed:', token);
      setFcmToken(token);
      // Optionally, update the token on your server
      // sendTokenToServer(token);
    });
  
    // Listen for foreground messages
    const unsubscribeMessage = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
  
    return () => {
      unsubscribeTokenRefresh();
      unsubscribeMessage();
    };
  }, []);

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    LibreBaskerville_400Regular,
    LibreBaskerville_700Bold,
  });


  if (!fontsLoaded) {
    return (
      <ActivityIndicator size="large" color={colors.background} />
    );
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

function RootNavigator() {
  const { user, authLoaded } = useContext(AuthContext);

  if (!authLoaded) {
    return (
      <View style={{flex: 1,justifyContent: 'center',alignItems: 'center',backgroundColor: colors.background,}}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ gestureEnabled: false, swipeEnabled: false, headerShown: false, animation: 'fade', cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,  }}>
      {user ? (
        <Stack.Screen name="MainScreen" component={MainPage} />
      ) : (
        <Stack.Screen name="LandingScreen" component={LandingPage} />
      )}
      <Stack.Screen name="SelectSchoolScreen" component={SelectSchool} />
      <Stack.Screen name="PersonalityQuizScreen" component={PersonalityQuiz} />
      <Stack.Screen name="QuizResultsScreen" component={QuizResults} />
      <Stack.Screen name="PhoneNumberScreen" component={PhoneNumber} />
      <Stack.Screen name="EmailPasswordScreen" component={EmailPassword} />
      <Stack.Screen name="GoogleInfoScreen" component={GoogleInfo} />
      <Stack.Screen name="QuoteScreen" component={QuotePage} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
    </Stack.Navigator>
  );
}

export default withIAPContext(App);
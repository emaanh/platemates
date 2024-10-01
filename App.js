import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
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


const Stack = createStackNavigator();


function App() {
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <ActivityIndicator size="large" color={colors.black} />
    );
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ gestureEnabled: false, swipeEnabled: false, headerShown: false  }}>
          <Stack.Screen name="LandingScreen" component={LandingPage} />
          <Stack.Screen name="SelectSchoolScreen" component={SelectSchool} />
          <Stack.Screen name="PersonalityQuizScreen" component={PersonalityQuiz} />
          <Stack.Screen name="QuizResultsScreen" component={QuizResults} />
          <Stack.Screen name="PhoneNumberScreen" component={PhoneNumber} />
          <Stack.Screen name="EmailPasswordScreen" component={EmailPassword} />
          <Stack.Screen name="MainScreen" component={MainPage} />
          <Stack.Screen name="QuoteScreen" component={QuotePage} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}


export default App;
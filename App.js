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


const Stack = createStackNavigator();


function App() {
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <ActivityIndicator size="large" color="black" />
    );
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ swipeEnabled: false, headerShown: false  }}>
          <Stack.Screen name="LandingScreen" component={LandingPage} />
          <Stack.Screen name="SelectSchoolScreen" component={SelectSchool} />
          <Stack.Screen name="PersonalityQuizScreen" component={PersonalityQuiz} />
          <Stack.Screen name="QuizResultsScreen" component={QuizResults} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}


export default App;
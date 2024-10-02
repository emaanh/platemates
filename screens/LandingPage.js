import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto'
import { LibreBaskerville_400Regular, LibreBaskerville_400Regular_Italic, LibreBaskerville_700Bold } from '@expo-google-fonts/libre-baskerville';
import AppLoading from 'expo-app-loading';
import { colors } from '../stylevars';

function LandingPage({navigation}) {
  let [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    LibreBaskerville_400Regular,
    LibreBaskerville_400Regular_Italic,
    LibreBaskerville_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {return (
    <View style={styles.container}>
      <Text style={styles.title}>Join Dinner with</Text>
      <Text style={styles.title}>3 Random</Text>
      <Text style={styles.title}>Students</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.getStartedButton} onPress={() => navigation.navigate('SelectSchoolScreen')}>
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.outlineButton} onPress={() => navigation.navigate('MainScreen')}>
          <Text style={styles.outlineButtonText}>I already have an account</Text>
        </TouchableOpacity>
      </View>
    </View>
    );
  }  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.black,
    fontSize: 40,
    fontFamily: 'LibreBaskerville_400Regular',
    marginBottom: 10,
    bottom: 60
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'absolute',
    bottom: 150
  },
  getStartedButton: {
    backgroundColor: colors.primary,
    width: '90%',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  getStartedText: {
    color: colors.black,
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
  },
  outlineButton: {
    borderColor: colors.black,
    borderWidth: 2,
    width: '90%',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  outlineButtonText: {
    color: colors.black,
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
  },
});

export default LandingPage;
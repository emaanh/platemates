import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto'
import { LibreBaskerville_400Regular, LibreBaskerville_400Regular_Italic, LibreBaskerville_700Bold } from '@expo-google-fonts/libre-baskerville';
import { colors } from '../stylevars';
import * as Haptics from 'expo-haptics';

function LandingPage({navigation}) {
  let [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    LibreBaskerville_400Regular,
    LibreBaskerville_400Regular_Italic,
    LibreBaskerville_700Bold,
  });

  const opacityAnim1 = useRef(new Animated.Value(0)).current;
  const opacityAnim2 = useRef(new Animated.Value(0)).current;
  const opacityAnim3 = useRef(new Animated.Value(0)).current;
  const translateXAnim1 = useRef(new Animated.Value(-100)).current;
  const translateXAnim2 = useRef(new Animated.Value(-100)).current;
  const translateXAnim3 = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    // Staggered animation sequence
    Animated.stagger(300, [
      Animated.parallel([
        Animated.timing(opacityAnim1, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(translateXAnim1, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(opacityAnim2, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(translateXAnim2, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(opacityAnim3, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(translateXAnim3, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [opacityAnim1, opacityAnim2, opacityAnim3, translateXAnim1, translateXAnim2, translateXAnim3]);

  if (!fontsLoaded) {
    return <ActivityIndicator />;
  } else {return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.title,
          {
            opacity: opacityAnim1,
            transform: [{ translateX: translateXAnim1 }],
          },
        ]}
      >
        Join Dinner with
      </Animated.Text>
      <Animated.Text
        style={[
          styles.title,
          {
            opacity: opacityAnim2,
            transform: [{ translateX: translateXAnim2 }],
          },
        ]}
      >
        3 Random
      </Animated.Text>
      <Animated.Text
        style={[
          styles.title,
          {
            opacity: opacityAnim3,
            transform: [{ translateX: translateXAnim3 }],
          },
        ]}
      >
        Students
      </Animated.Text>

      {/* <Text style={styles.title}>Join Dinner with</Text>
      <Text style={styles.title}>3 Random</Text>
      <Text style={styles.title}>Students</Text> */}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.getStartedButton} onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            navigation.navigate('SelectSchoolScreen')
          }}>
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.outlineButton} onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          navigation.navigate('LoginScreen')}}>
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
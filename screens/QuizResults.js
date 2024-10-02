import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Animated, Easing } from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons'; // Import FontAwesome for Google icon
import Svg, { Circle } from 'react-native-svg';
import { colors } from '../stylevars';

function QuizResults({ navigation, route }) {
  const [isMatching, setIsMatching] = useState(true);
  const [compatibleStudents, setCompatibleStudents] = useState(0); // Store the random number
  const { school, answers } = route.params;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const randomStudents = Math.floor(Math.random() * 46) + 5;
    setCompatibleStudents(randomStudents);

    const timer = setTimeout(() => {
      setIsMatching(false);
    }, 3000);

    const startRotation = () => {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    };

    startRotation();

    return () => clearTimeout(timer);
  }, [rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {isMatching ? (
        <>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Svg height="100" width="100" viewBox="0 0 100 100">
              <Circle
                cx="50"
                cy="50"
                r="40"
                stroke={colors.white}
                strokeWidth="5"
                fill="none"
                strokeDasharray="251.2"
                strokeDashoffset="50"
              />
            </Svg>
          </Animated.View>
          <Text style={styles.resultsText}>Matching You With Compatible Students</Text>
        </>
      ) : (
        <>
          <Feather name="check-circle" size={100} color={colors.white} />
          <Text style={styles.resultsText}>
            We have found {compatibleStudents} compatible students at {school[1]}
          </Text>
          <TouchableOpacity style={styles.googleButton} onPress={() => navigation.navigate('MainPage')}>
            <FontAwesome name="google" size={24} color={colors.dark_grey} style={styles.googleIcon} /> 
            <Text style={styles.googleButtonText}>Sign up with Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.emailButton} onPress={() => navigation.navigate('PhoneNumberScreen', { school, answers })}>
            <Text style={styles.emailButtonText}>Sign up with email</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.yellow, // Yellow background
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchingText: {
    marginTop: 20,
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Poppins_700Bold',
  },
  resultsText: {
    marginTop: 20,
    color: colors.black,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Poppins_700Bold',
    width: '90%',
  },
  emailButton: {
    position: 'absolute',
    backgroundColor: colors.dark_grey, // Dark grey buttons
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10, // Space between buttons
    alignItems: 'center',
    bottom: 50,
    width: '90%',
    alignItems: 'center',
  },
  emailButtonText: {
    color: colors.white, // White text on the buttons
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
  },
  googleButton: {
    position: 'absolute',
    backgroundColor: colors.white, // Dark grey buttons
    flexDirection: 'row', // To align the icon with the text
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10, // Space between buttons
    bottom: 120,
    width: '90%',
    alignItems: 'center',
  },
  googleButtonText: {
    color: colors.dark_grey, // Dark grey text on the buttons
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
    marginLeft: 10, // Add some space between the icon and the text
  },
  googleIcon: {
    marginRight: 2.5, // Add space between icon and text
  },
});

export default QuizResults;
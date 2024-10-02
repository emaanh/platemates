import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Animated 
} from 'react-native';
import { colors } from '../stylevars'; // Ensure this contains the necessary color definitions
import { AuthContext } from '../AuthProvider';

function QuotePage({ navigation }) {

  const messages = [
    'Hello Emaan Heidari',
    '“The best way to predict the future is to create it.” – Peter Drucker',
    '“Life is 10% what happens to us and 90% how we react to it.” – Charles R. Swindoll',
    '“Your time is limited, so don’t waste it living someone else’s life.” – Steve Jobs'
  ];

  const [currentStep, setCurrentStep] = useState(0);

  
  const fadeAnim = useRef(new Animated.Value(0)).current; // Message starts invisible
  const buttonFadeAnim = useRef(new Animated.Value(0)).current; // Button starts invisible

  useEffect(() => {
    // Fade in the message
    fadeAnim.setValue(0); // Reset opacity to 0 before fading in
    Animated.timing(fadeAnim, {
      toValue: 1, // Fade to fully visible
      duration: 500, // Duration of the fade-in
      useNativeDriver: true, // Use native driver for better performance
    }).start();

    // Reset button opacity
    buttonFadeAnim.setValue(0); // Ensure button starts as invisible

    // Show the "Next" button after 3 seconds with fade-in
    const timer = setTimeout(() => {
      Animated.timing(buttonFadeAnim, {
        toValue: 1, // Fade to fully visible
        duration: 500, // Duration of the fade-in
        useNativeDriver: true,
      }).start();
    }, 1000); // 1-second delay

    // Cleanup the timer when the component unmounts or before the next effect runs
    return () => clearTimeout(timer);
  }, [currentStep, fadeAnim, buttonFadeAnim]);

  const handleNext = () => {
    // Simultaneously fade out both the message and the button
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0, // Fade message to invisible
        duration: 500, // Duration of the fade-out
        useNativeDriver: true,
      }),
      Animated.timing(buttonFadeAnim, {
        toValue: 0, // Fade button to invisible
        duration: 500, // Duration of the fade-out
        useNativeDriver: true,
      }),
    ]).start(() => {
      // After both animations have completed
      if (currentStep < messages.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        // Navigate to MainPage after the last message
        navigation.navigate('MainScreen');
      }
    });
  };

  return (
    <View style={styles.container}>
      {/* Animated Message */}
      <Animated.View style={[styles.messageContainer, { opacity: fadeAnim }]}>
        <Text style={styles.messageText}>{messages[currentStep]}</Text>
      </Animated.View>
      
      {/* Animated "Next" Button */}
      <Animated.View style={[styles.nextButtonContainer, { opacity: buttonFadeAnim }]}>
        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={handleNext}
          accessible={true}
          accessibilityLabel="Next Quote"
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // Background color
    paddingHorizontal: 20,
    paddingTop: 55,
    justifyContent: 'center', // Center content vertically
  },
  messageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageText: {
    color: colors.black, // Text color
    fontSize: 24,
    textAlign: 'center',
    paddingHorizontal: 10,
    marginBottom: 90,
    fontFamily: 'LibreBaskerville_400Regular',
  },
  nextButtonContainer: {
    position: 'absolute',
    bottom: 50, // Position 30 units from the bottom
    left: '10%', // Center the button horizontally by setting left and right
    right: '10%',
    alignItems: 'center',
  },
  nextButton: {
    //backgroundColor: colors.primary, // Button background color (orange)
    paddingVertical: 12.5,
    paddingHorizontal: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: colors.black,
    width: '100%', // Make the button take the full width of the container
    alignItems: 'center', // Center the text horizontally
  },
  buttonText: {
    color: colors.black, // Text color
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'LibreBaskerville_700Bold',
  },
});

export default QuotePage;
import React, { useEffect, useRef, useState } from 'react';
import { 
  ActivityIndicator, 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Animated, 
  Modal, 
  ScrollView,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { 
  LibreBaskerville_400Regular, 
  LibreBaskerville_400Regular_Italic, 
  LibreBaskerville_700Bold 
} from '@expo-google-fonts/libre-baskerville';
import { colors } from '../stylevars';
import * as Haptics from 'expo-haptics';

function LandingPage({ navigation }) {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    LibreBaskerville_400Regular,
    LibreBaskerville_400Regular_Italic,
    LibreBaskerville_700Bold,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');

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
  }, [
    opacityAnim1,
    opacityAnim2,
    opacityAnim3,
    translateXAnim1,
    translateXAnim2,
    translateXAnim3,
  ]);

  const openModal = (content) => {
    setModalContent(content);
    setModalVisible(true);
  };

  if (!fontsLoaded) {
    return <ActivityIndicator />;
  }

  return (
    <View style={styles.container}>
      {/* <Image 
        source={require('../assets/logo.png')} // Adjust the path to your logo image accordingly
        style={styles.logo}                      // Apply styling to the logo
      /> */}
      <Animated.Text
        style={[
          styles.title,
          { opacity: opacityAnim1, transform: [{ translateX: translateXAnim1 }] },
        ]}
      >
        Join Dinner with
      </Animated.Text>
      <Animated.Text
        style={[
          styles.title,
          { opacity: opacityAnim2, transform: [{ translateX: translateXAnim2 }] },
        ]}
      >
        3 Random
      </Animated.Text>
      <Animated.Text
        style={[
          styles.title,
          { opacity: opacityAnim3, transform: [{ translateX: translateXAnim3 }] },
        ]}
      >
        Students
      </Animated.Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            navigation.navigate('SelectSchoolScreen');
          }}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.outlineButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            navigation.navigate('LoginScreen');
          }}
        >
          <Text style={styles.outlineButtonText}>
            I already have an account
          </Text>
        </TouchableOpacity>

        <Text style={styles.termsText}>
          By signing up, you agree to the{' '}
          <Text
            style={styles.linkText}
            onPress={() => openModal('Terms of Service')}
          >
            Terms of Service
          </Text>{' '}
          {/* and{' '}
          <Text
            style={styles.linkText}
            onPress={() => openModal('Privacy Policy')}
          >
            Privacy Policy
          </Text> */}
          .
        </Text>
        <Text style={[styles.termsText, { top: 30 }]}>
          Contact: 650-282-0663
        </Text>
      </View>

      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>✖</Text>
          </TouchableOpacity>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Terms of Service</Text>
          </View>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.content}>
              <Text style={styles.boldText}>Last Updated:</Text> [10/11/24]{"\n\n"}

              <Text style={styles.boldText}>1. Acceptance of Terms</Text>{"\n\n"}
              By accessing and using PlateMates ("App"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this App.{"\n\n"}

              <Text style={styles.boldText}>2. Use of the App</Text>{"\n\n"}
              You agree to use the App only for lawful purposes and in a way that does not infringe the rights of others or restrict or inhibit anyone else's use of the App.{"\n\n"}

              <Text style={styles.boldText}>3. User Accounts</Text>{"\n\n"}
              You may be required to create an account to use certain features of the App. You are responsible for maintaining the confidentiality of your account and password.{"\n\n"}

              <Text style={styles.boldText}>4. Privacy Policy</Text>{"\n\n"}
              Your use of the App is also subject to our Privacy Policy. Please review our Privacy Policy, which governs the App and informs users of our data collection practices.{"\n\n"}

              <Text style={styles.boldText}>5. Intellectual Property Rights</Text>{"\n\n"}
              All content included in the App, such as text, graphics, logos, images, and software, is the property of PlateMates or its content suppliers and is protected by intellectual property laws.{"\n\n"}

              <Text style={styles.boldText}>6. Limitation of Liability</Text>{"\n\n"}
              PlateMates shall not be liable for any damages whatsoever arising out of the use of or inability to use the App, even if PlateMates has been advised of the possibility of such damages.{"\n\n"}

              <Text style={styles.boldText}>7. Changes to Terms</Text>{"\n\n"}
              We reserve the right to modify these terms at any time. Any changes will be effective immediately upon posting on the App. Your continued use of the App after any modification signifies your acceptance of the new terms.{"\n\n"}

              <Text style={styles.boldText}>8. Governing Law</Text>{"\n\n"}
              These terms shall be governed by and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law provisions.{"\n\n"}

              <Text style={styles.boldText}>9. Contact Information</Text>{"\n\n"}
              If you have any questions about these Terms, please contact us at: emaan@heidari.co.{"\n\n"}
            </Text>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
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
    bottom: 60,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    position: 'absolute',
    bottom: '13%',
  },
  getStartedButton: {
    backgroundColor: colors.primary,
    width: '90%',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 200,            // Adjust width as needed
    height: 200,           // Adjust height as needed
    resizeMode: 'contain', // Ensures the image scales properly
    marginBottom: 0,      // Adds space below the logo
    marginTop: -150
  },
  getStartedText: {
    color: colors.black,
    fontSize: 18,
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
    fontFamily: 'Poppins_700Bold',
  },
  termsText: {
    color: 'grey',
    fontSize: 13,
    textAlign: 'center',
    top: 20,
    width: '80%',
  },
  linkText: {
    textDecorationLine: 'underline',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  closeButton: {
    position: 'absolute',
    zIndex: 100,
    top: 62.5,
    right: 20,
  },
  closeButtonText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  modalContent: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
  },
  headerTitle: {
    color: colors.black,
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'LibreBaskerville_700Bold',
  },
  /* Content Styles */
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  content: {
    color: colors.black,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
  boldText: {
    fontWeight: 'bold',
    fontFamily: 'LibreBaskerville_700Bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 65,
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
});

export default LandingPage;
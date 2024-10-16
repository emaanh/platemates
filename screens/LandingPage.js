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
  Image,
  Linking
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

  const openPrivacyPolicy = async () => {
    const url = 'https://www.platemates.app/privacy';
    // Check if the link can be opened
    const supported = await Linking.canOpenURL(url);
  
    if (supported) {
      // Open the link with the default browser
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  };

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
      Wanna Meet
      </Animated.Text>
      <Animated.Text
        style={[
          styles.title,
          { opacity: opacityAnim2, transform: [{ translateX: translateXAnim2 }] },
        ]}
      >
      3 Students
      </Animated.Text>
      <Animated.Text
        style={[
          styles.title,
          { opacity: opacityAnim3, transform: [{ translateX: translateXAnim3 }] },
        ]}
      >
      over Dinner?
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
            EULA
          </Text>{' '}
          and{' '}
          <Text
            style={styles.linkText}
            onPress={() => openPrivacyPolicy()}
          >
            Privacy Policy
          </Text>
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
            <Text style={styles.headerTitle}>EULA</Text>
          </View>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.content}>
              <Text style={styles.boldText}>Last Updated:</Text> [10/11/22]{"\n\n"}

              <Text style={styles.boldText}>1. Introduction</Text>{"\n\n"}
              This End User License Agreement ("Agreement") is a legal agreement between you ("User" or "you") and <Text style={styles.boldText}>PlateMates</Text> ("Company," "we," or "us") concerning your use of the PlateMates mobile application ("App"). By downloading, installing, or using the App, you agree to be bound by the terms of this Agreement.{"\n\n"}

              <Text style={styles.boldText}>2. License Grant</Text>{"\n\n"}
              We grant you a limited, non-exclusive, non-transferable, revocable license to use the App for personal, non-commercial purposes, strictly in accordance with the terms of this Agreement.{"\n\n"}

              <Text style={styles.boldText}>3. License Restrictions</Text>{"\n\n"}
              You agree not to:{"\n"}
              - Modify, reverse engineer, decompile, or disassemble the App.{"\n"}
              - Rent, lease, loan, sell, sublicense, distribute, or otherwise transfer the App to any third party.{"\n"}
              - Use the App in any unlawful manner or for any illegal purpose.{"\n\n"}

              <Text style={styles.boldText}>4. Intellectual Property Rights</Text>{"\n\n"}
              All rights, title, and interest in and to the App, including but not limited to any content, graphics, user interface, and scripts, are owned by PlateMates. This Agreement does not grant you any rights to our trademarks or service marks.{"\n\n"}

              <Text style={styles.boldText}>5. Updates and Changes</Text>{"\n\n"}
              We may provide updates, modifications, or patches to the App. You agree that we have no obligation to provide any updates or to continue to provide or enable any features or functionality of the App.{"\n\n"}

              <Text style={styles.boldText}>6. Termination</Text>{"\n\n"}
              This Agreement is effective until terminated. Your rights under this Agreement will terminate automatically without notice if you fail to comply with any terms. Upon termination, you must cease all use of the App and delete all copies.{"\n\n"}

              <Text style={styles.boldText}>7. Disclaimer of Warranties</Text>{"\n\n"}
              The App is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied. We disclaim all warranties, including but not limited to implied warranties of merchantability and fitness for a particular purpose.{"\n\n"}

              <Text style={styles.boldText}>8. Limitation of Liability</Text>{"\n\n"}
              In no event shall PlateMates be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use or inability to use the App.{"\n\n"}

              <Text style={styles.boldText}>9. Governing Law</Text>{"\n\n"}
              This Agreement shall be governed by and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law provisions.{"\n\n"}

              <Text style={styles.boldText}>10. Contact Information</Text>{"\n\n"}
              If you have any questions about this Agreement, please contact us at emaan@heidari.co.{"\n\n"}
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
// TermsAndConditionsScreen.js
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../../stylevars';

function TermsAndConditionsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={30} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms and Conditions</Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.content}>
          **Last Updated:** [Date]{"\n\n"}

          **1. Acceptance of Terms**{"\n\n"}
          By accessing and using PlateMates ("App"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this App.{"\n\n"}

          **2. Use of the App**{"\n\n"}
          You agree to use the App only for lawful purposes and in a way that does not infringe the rights of others or restrict or inhibit anyone else's use of the App.{"\n\n"}

          **3. User Accounts**{"\n\n"}
          You may be required to create an account to use certain features of the App. You are responsible for maintaining the confidentiality of your account and password.{"\n\n"}

          **4. Privacy Policy**{"\n\n"}
          Your use of the App is also subject to our Privacy Policy. Please review our Privacy Policy, which governs the App and informs users of our data collection practices.{"\n\n"}

          **5. Intellectual Property Rights**{"\n\n"}
          All content included in the App, such as text, graphics, logos, images, and software, is the property of PlateMates or its content suppliers and is protected by intellectual property laws.{"\n\n"}

          **6. Limitation of Liability**{"\n\n"}
          PlateMates shall not be liable for any damages whatsoever arising out of the use of or inability to use the App, even if PlateMates has been advised of the possibility of such damages.{"\n\n"}

          **7. Changes to Terms**{"\n\n"}
          We reserve the right to modify these terms at any time. Any changes will be effective immediately upon posting on the App. Your continued use of the App after any modification signifies your acceptance of the new terms.{"\n\n"}

          **8. Governing Law**{"\n\n"}
          These terms shall be governed by and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law provisions.{"\n\n"}

          **9. Contact Information**{"\n\n"}
          If you have any questions about these Terms, please contact us at [Contact Email or Address].{"\n\n"}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  /* Header Styles */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 55,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
  },
  /* Content Styles */
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'Poppins_700Bold',
  },
  content: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
});

export default TermsAndConditionsScreen;
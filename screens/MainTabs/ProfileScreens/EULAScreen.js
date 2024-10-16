// EULAScreen.js
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../../stylevars';

function EULAScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={30} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>EULA</Text>
      </View>

      {/* Content */}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  /* Header Styles */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 55,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    color: colors.black,
    fontSize: 24,
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
});

export default EULAScreen;
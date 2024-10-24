import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { colors } from '../../../stylevars';
import * as Haptics from 'expo-haptics';

function Help({ navigation }) {
  const [faqs, setFaqs] = useState([
    {
      question: 'How does Platemates work?',
      answer:
        'You take a quick personality quiz, and we’ll match you with three other students from your school. Once matched, you’ll receive an invitation to join a group dinner.',
    },
    {
      question: 'How are matches made?',
      answer:
        'We use a mix of personality traits and preferences from our quiz to create matches that are likely to click. Our goal is to match you with people you’ll enjoy spending time with.',
    },
    {
      question: 'Is Platemates a dating app?',
      answer:
        'No, Platemates is focused on creating opportunities for genuine social interactions. It’s all about meeting new people and building friendships, not finding romantic connections.',
    },
    {
      question: "What if I can't make a dinner I signed up for?",
      answer:
        'Life happens, and we get it! If you used a ticket, contact us for a refund!',
    },
  ]);

  const openEmail = () => {
    Linking.openURL('mailto:support@yourapp.com');
  };

  const openPhone = () => {
    Linking.openURL('tel:+16504506083');
  };

  return (
    <View style={styles.screenContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            navigation.goBack();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Feather name="arrow-left" size={30} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={[styles.contactItem,{marginBottom: 10}]}>
          <Feather name="mail" size={24} color={colors.primary} />
          <TouchableOpacity onPress={openEmail}>
            <Text style={styles.contactText}>emaan@heidari.co</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.contactItem}>
          <Feather name="phone" size={24} color={colors.primary} />
          <TouchableOpacity onPress={openPhone}>
            <Text style={styles.contactText}>650-450-6083</Text>
          </TouchableOpacity>
        </View>
        {/* FAQ Section */}
        {faqs.map((faq, index) => (
          <View key={index} style={styles.faqItem}>
            <Text style={styles.question}>{faq.question}</Text>
            <Text style={styles.answer}>{faq.answer}</Text>
          </View>
        ))}

        {/* Contact Information */}
        {/* <Text style={styles.sectionTitle}>Contact Us</Text> */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 65,
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    alignSelf: 'center',
    color: colors.black,
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'LibreBaskerville_700Bold',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    color: colors.black,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    fontFamily: 'Poppins_700Bold'
  },
  faqItem: {
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: colors.black,
    borderWidth: 1
  },
  question: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    fontFamily: 'Poppins_400Regular'
  },
  answer: {
    color: colors.black,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular'
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: colors.black,
    borderWidth: 1
  },
  contactText: {
    color: colors.black,
    fontSize: 16,
    marginLeft: 10,
    textDecorationLine: 'underline',
    fontFamily: 'Poppins_400Regular'
  },
});

export default Help;
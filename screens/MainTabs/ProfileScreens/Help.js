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

function Help({ navigation }) {
  const [faqs, setFaqs] = useState([
    {
      question: 'How do I make a booking?',
      answer:
        'To make a booking, navigate to the Bookings section and select "Book my Seat". Follow the on-screen instructions to complete your reservation.',
    },
    {
      question: 'Can I cancel my booking?',
      answer:
        'Yes, you can cancel your booking up to 24 hours before the scheduled time. Please contact our support team for assistance.',
    },
    {
      question: 'What payment methods are accepted?',
      answer:
        'We accept various payment methods including credit/debit cards, PayPal, and Apple Pay.',
    },
    // Add more FAQs as needed
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
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={30} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* FAQ Section */}
        {faqs.map((faq, index) => (
          <View key={index} style={styles.faqItem}>
            <Text style={styles.question}>{faq.question}</Text>
            <Text style={styles.answer}>{faq.answer}</Text>
          </View>
        ))}

        {/* Contact Information */}
        {/* <Text style={styles.sectionTitle}>Contact Us</Text> */}
        <View style={[styles.contactItem,{marginTop: 10}]}>
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
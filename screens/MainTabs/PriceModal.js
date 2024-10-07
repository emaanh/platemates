import React, { useState } from 'react';
import { Modal, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../stylevars'; // Import colors from stylevars.js
import { SafeAreaView } from 'react-native-safe-area-context';

const PriceModal = ({ closeModal, isVisible, onClose, setUserInEvent }) => {
  const [selectedOption, setSelectedOption] = useState('1 Month'); // Default to "1 Month"

  // Update the buy button text based on the selected option
  const getBuyButtonText = () => {
    if (selectedOption === 'Single Ticket') {
      return 'Buy Single Ticket';
    }
    return `Buy ${selectedOption}`;
  };

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
          <Text style={styles.closeButtonText}>✖</Text>
        </TouchableOpacity>

        {/* Description Section */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Access to All Dinners</Text>
          <Text style={styles.descriptionText}>Subscribe for unlimited access to dinners every Wednesday</Text>
        </View>

        {/* Subscription Options */}
        <View style={styles.optionsContainer}>
          {[
            { title: '1 Month', perMonth: '$9', total: '$9' },
            { title: '3 Months', perMonth: '$7', originalPerMonth: '$9', total: '$23.97', discount: '20% OFF' },
            { title: '6 Months', perMonth: '$5', originalPerMonth: '$9', total: '$35.94', discount: '40% OFF' },
          ].map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedOption === option.title && styles.selectedOption,
              ]}
              onPress={() => setSelectedOption(option.title)}
            >
              <View style={styles.optionContent}>
                <View style={styles.textContainer}>
                  <Text style={styles.optionText}>{option.title}</Text>
                  <Text style={styles.optionTotal}>{`Total: ${option.total}`}</Text>
                  {option.discount && <Text style={styles.discountTag}>{option.discount}</Text>}
                </View>
                <Text style={styles.pricePerMonth}>
                  {/* {option.originalPerMonth && (
                    <Text style={styles.strikethrough}>{option.originalPerMonth} </Text>
                  )} */}
                  {`${option.perMonth} / month`}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Separator and Single Ticket Section */}
        <View style={styles.separator} />

        {/* Single Ticket Option */}
        <TouchableOpacity
          style={[
            styles.optionButton,
            selectedOption === 'Single Ticket' && styles.selectedOption,
          ]}
          onPress={() => setSelectedOption('Single Ticket')}
        >
          <View style={styles.optionContent}>
            <View style={styles.textContainer}>
              <Text style={styles.optionText}>Single Ticket</Text>
              <Text style={styles.optionTotal}>For one dinner</Text>
            </View>
            <Text style={styles.pricePerMonth}>$4</Text>
          </View>
        </TouchableOpacity>

        {/* Buy Button */}
        <TouchableOpacity
          style={[
            styles.buyButton,
            !selectedOption && styles.disabledButton,
          ]}
          onPress={() => {
            if (selectedOption) {
              setUserInEvent(true);
              console.log(getBuyButtonText());
            }
          }}
          disabled={!selectedOption}
        >
          <Text style={styles.buyButtonText}>{getBuyButtonText()}</Text>
          {/* Only show "Cancel Anytime" if the selected option is not "Single Ticket" */}
          {selectedOption !== 'Single Ticket' && (
            <Text style={styles.cancelText}>Cancel Anytime</Text>
          )}
        </TouchableOpacity>

      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    paddingTop: 40, // Add padding to move everything down
    justifyContent: 'center', // Center content vertically
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 30,
    color: colors.black,
    textAlign: 'center',
    fontWeight: 'bold',
    marginVertical: 20,
    fontFamily: 'Poppins_700Bold',
  },
  descriptionContainer: {
    marginTop: -20,
    marginBottom: 20,
  },
  descriptionTitle: {
    color: colors.black,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Poppins_700Bold',
  },
  descriptionText: {
    color: colors.grey,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
    fontFamily: 'Poppins_400Regular',
  },
  optionsContainer: {
    marginBottom: 20,
  },
  separator: {
    height: 1,
    backgroundColor: colors.separator,
    marginBottom: 20,
  },
  singleTicketTitle: {
    color: colors.black,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Poppins_700Bold',
  },
  optionButton: {
    backgroundColor: colors.background,
    padding: 15,
    marginVertical: 8,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.optionBorder,
  },
  goldBorder: {
    borderColor: colors.gold,
    borderWidth: 2,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  textContainer: {
    alignItems: 'flex-start',
    flex: 1,
  },
  optionText: {
    color: colors.black,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
  },
  optionTotal: {
    color: colors.dark_grey,
    fontSize: 12,
    marginTop: 5,
    fontFamily: 'Poppins_400Regular',
  },
  discountTag: {
    color: colors.dark_grey,
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
  },
  pricePerMonth: {
    color: colors.black,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
    fontFamily: 'Poppins_700Bold',
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    color: colors.grey,
  },
  selectedOption: {
    backgroundColor: colors.light_grey,
  },
  buyButton: {
    backgroundColor: colors.green,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: colors.green,
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: colors.disabled,
  },
  buyButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
  },
  cancelText: {
    color: colors.background,
    fontSize: 12,
    marginTop: 5,
    fontFamily: 'Poppins_400Regular',
  },
  closeButton: {
    position: 'absolute',
    top: 55,
    right: 20,
    zIndex: 1,
    padding: 10,
  },
  closeButtonText: {
    color: colors.black,
    fontSize: 30,
  },
});

export default PriceModal;
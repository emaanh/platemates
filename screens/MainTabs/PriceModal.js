import React, { useState, useEffect, useContext } from 'react';
import { Dimensions, Platform, Modal, Text, View, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Linking } from 'react-native';
import { colors } from '../../stylevars'; // Import colors from stylevars.js
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAvailablePurchases, initConnection, getProducts, getSubscriptions, requestPurchase, finishTransaction, currentPurchase, getPurchaseHistory } from 'react-native-iap';
import { AuthContext } from '../../AuthProvider';
import { addDoc, doc, collection, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/firebase-config';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const isSmallDevice = SCREEN_WIDTH < 400;
const scaleFont = (size) => {
  const scale = SCREEN_WIDTH / 375; // 375 is a common base width (e.g., iPhone 8)
  const newSize = size * scale;
  return Math.round(newSize);
};

const PriceModal = ({ closeModal, isVisible, onClose, PromptSubscribe, PromptTicket}) => {
  const [selectedOption, setSelectedOption] = useState('1 Month'); // Default to "1 Month"
  const { setCaller, caller, user, userData } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const getBuyButtonText = () => {
    if (selectedOption === 'Single Ticket') {
      return 'Buy Single Ticket';
    }
    return `Buy ${selectedOption}`;
  };

  const handleBuyProduct = async () => {
    setLoading(true); // Start showing the activity indicator
  
    let sku;
    switch (selectedOption) {
      case '1 Month':
        sku = 'month1';
        break;
      case '3 Months':
        sku = 'month3';
        break;
      case '6 Months':
        sku = 'month6';
        break;
      case 'Single Ticket':
        sku = '1time';
        break;
      default:
        sku = '1time';
        break;
    }
  
    try {
      const purchaseResult = await requestPurchase({ sku });
  
      if (purchaseResult.transactionReceipt && purchaseResult.transactionId) {
        // const isValid = await validateReceiptWithServer(purchaseResult.transactionReceipt);
        const isValid = true;
        const isTicket = selectedOption == 'Single Ticket';
  
        if (isValid) {
          closeModal();
          await addDoc(collection(db, 'users', user.uid, 'purchases'), {
            isTicket,
            purchase: selectedOption,
            serverTimestamp: serverTimestamp(),
            IAPTimestamp: Timestamp.fromMillis(parseInt(purchaseResult.transactionDate)),
            receipt: purchaseResult.transactionReceipt,
            transactionID: purchaseResult.transactionId,
          });

          if (isTicket) {
            await finishTransaction({purchase: purchaseResult, isConsumable: true});
            const tempArray = userData.tickets;
            tempArray.push(new Date());
            await setDoc(doc(db, 'users', user.uid), { tickets: tempArray }, { merge: true });
            setCaller(!caller);
          } else{
            await finishTransaction({purchase: purchaseResult});
            setCaller(!caller);
          }
          // Alert.alert(`${selectedOption} purchased!`);
  
          if (selectedOption == 'Single Ticket') {
            PromptTicket();
          } else {
            PromptSubscribe();
          }
        }
      } else {
        throw new Error('Purchase failed');
      }
    } catch (error) {
      console.log()
      Alert.alert('Purchase Error', error.message);
    } finally {
      setLoading(false); // Stop showing the activity indicator
    }
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
          <Text style={styles.descriptionTitle}>Access to Weekly Dinners</Text>
          <Text style={styles.descriptionText}>Subscribe for 4 dinners each month</Text>
        </View>

        {/* Subscription Options */}
        <View style={styles.optionsContainer}>
          {[
            { title: '1 Month', perMonth: '$1.99', total: '$7.99', discount: 'Perfect for first-timers' },
            { title: '3 Months', perMonth: '$1.25', originalPerMonth: '$9.99', total: '$14.99', discount: 'Popular for regular attendees' },
            { title: '6 Months', perMonth: '$0.83', originalPerMonth: '$9.99', total: '$19.99', discount: 'Maximum savings' },
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
                  {option.discount && <Text style={styles.discountTag}>{option.discount}</Text>}
                </View>
                <View style={styles.textContainer2}>
                  <Text style={styles.pricePerMonth}>
                    {`${option.perMonth} / dinner`}
                  </Text>
                  <Text style={styles.optionTotal}>{`Total: ${option.total}`}</Text>
                </View>
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
            <Text style={styles.pricePerMonth}>$4.99</Text>
          </View>
        </TouchableOpacity>


        {/* Buy Button */}
        <TouchableOpacity
          style={[
            styles.buyButton,
            !selectedOption && styles.disabledButton,
          ]}
          onPress={handleBuyProduct}
          disabled={!selectedOption}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.background} />
          ) : (
            <>
              <Text style={styles.buyButtonText}>{getBuyButtonText()}</Text>
              {selectedOption !== 'Single Ticket' && (
                <Text style={styles.cancelText}>Cancel Anytime</Text>
              )}
            </>
          )}
        </TouchableOpacity>
        <View style={styles.autoRenewContainer}>
        <Text style={styles.autoRenewText}>
        Subscriptions auto-renew unless canceled 24 hours before expiration via iTunes settings. Purchases provide a software service matching four individuals to meet at a designated restaurant; meals are not included. Platemates does not sell any physical goods or services. Dinners with fewer than three participants will be refunded upon request. {"\n"}
          <Text
            style={styles.link}
            onPress={() => Linking.openURL('https://www.platemates.app/privacy')}
          >
            Privacy Policy
          </Text>{" "}
          &{" "}
          <Text
            style={styles.link}
            onPress={() => Linking.openURL('https://www.platemates.app/eula')}
          >
            Terms of Use
          </Text>
        </Text>
      </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    paddingTop: 40,
    justifyContent: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: isSmallDevice ? 24 : 30, // Reduced font size for small devices
    color: colors.black,
    textAlign: 'center',
    fontWeight: 'bold',
    marginVertical: 20,
    fontFamily: 'Poppins_700Bold',
  },
  descriptionContainer: {
    marginTop: isSmallDevice ? 0 : -20,
    marginBottom: isSmallDevice ? 0 : 20,
  },
  descriptionTitle: {
    color: colors.black,
    fontSize: isSmallDevice ? 20 : 24,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Poppins_700Bold',
  },
  descriptionText: {
    color: colors.dark_grey,
    fontSize: isSmallDevice ? 14 : 16, // Adjusted font size
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 20,
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
    marginVertical: 10,
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
  textContainer2: {
    alignItems: 'flex-end',
    flex: 1,
  },
  optionText: {
    color: colors.black,
    fontSize: isSmallDevice ? 14 : 16, // Adjusted font size
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
  },
  optionTotal: {
    color: colors.dark_grey,
    fontSize: isSmallDevice ? 10 : 12, // Adjusted font size
    marginTop: 5,
    fontFamily: 'Poppins_400Regular',
  },
  discountTag: {
    color: colors.dark_grey,
    fontSize: isSmallDevice ? 10 : 12, // Adjusted font size
    fontWeight: 'bold',
    marginTop: 5,
  },
  pricePerMonth: {
    color: colors.black,
    fontSize: isSmallDevice ? 14 : 16, // Adjusted font size
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
    justifyContent: 'center',
    textAlign: 'center'
  },
  disabledButton: {
    backgroundColor: colors.disabled,
  },
  buyButtonText: {
    color: colors.background,
    fontSize: isSmallDevice ? 16 : 18, // Adjusted font size
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
  },
  cancelText: {
    color: colors.background,
    fontSize: isSmallDevice ? 10 : 12, // Adjusted font size
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
  autoRenewContainer: {
    marginTop: 20,
    marginBottom:-50,
    paddingHorizontal: 10,
  },
  autoRenewText: {
    color: colors.grey,
    fontSize: isSmallDevice ? 8 : 10, // Adjusted font size
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
  },
  link: {
    color: colors.ice, // or any color you prefer for the links
    textDecorationLine: 'underline',
  },
});

export default PriceModal;
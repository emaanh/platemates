import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { Feather } from '@expo/vector-icons';
import { colors, questions } from '../../stylevars';

const { width, height } = Dimensions.get('window');

function IcebreakerScreen({ navigation }) {
  const [cardIndex, setCardIndex] = useState(0);

  const renderCard = (card) => {
    return (
      <View style={styles.card}>
        <Text style={styles.cardText}>{card.text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Feather name="arrow-left" size={30} color={colors.black} />
      </TouchableOpacity>

      <Text style={styles.title}>Icebreaker</Text>

      <View style={[styles.swiperContainer, {backgroundColor: 'transparent'}]}>
        <Swiper
          cards={questions}
          renderCard={renderCard}
          onSwiped={(index) => setCardIndex(index)}
          onSwipedAll={() => {
            console.log('All cards swiped');
          }}
          cardIndex={cardIndex}
          backgroundColor="transparent"
          stackSize={3}
          stackSeparation={15}
          overlayLabels={{
            left: {
              title: 'Skip!',
              style: {
                label: {
                  // backgroundColor: colors.white,
                  color: colors.red,
                  fontSize: 30,
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-start',
                  marginTop: 20,
                  marginLeft: -20,
                },
              },
            },
            right: {
              title: 'Answered!',
              style: {
                label: {
                  // borderColor: colors.black,
                  color: colors.green,
                  fontSize: 30,
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  marginTop: 20,
                  marginLeft: 20,
                },
              },
            },
          }}
          animateOverlayLabelsOpacity
          animateCardOpacity
          swipeBackCard
          overlayOpacityVerticalThreshold={height/10000}
          overlayOpacityHorizontalThreshold={width/10000}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 55,
    left: 20,
    zIndex: 1,
  },
  title: {
    position: 'absolute',
    alignSelf: 'center',
    color: colors.black,
    fontSize: 24, // Changed from string to number
    fontFamily: 'LibreBaskerville_700Bold',
    top: 55,
  },
  swiperContainer: {
    top: 60,
    right: 20,
    flex: 1,
    width: width * 0.9,
    alignSelf: 'center',
    justifyContent: 'center'
  },
  card: {
    flex: 0.75,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.black,
    backgroundColor: colors.ice,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cardText: {
    color: colors.black,
    fontSize: 35,
    textAlign: 'center',
    fontFamily: "LibreBaskerville_400Regular",
  },
});

export default IcebreakerScreen;
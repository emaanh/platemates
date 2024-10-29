import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../stylevars';
import { db } from '../../firebase/firebase-config';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

const { width, height } = Dimensions.get('window');

function IcebreakerScreen({ navigation }) {
  const [cardIndex, setCardIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questionsRef = collection(db, 'questions');
        const questionsQuery = query(questionsRef, orderBy('index'));
        const querySnapshot = await getDocs(questionsQuery);

        const questionsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setQuestions(questionsList);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false); // Stop loading whether successful or error
      }
    };

    fetchQuestions();
  }, []);

  const renderCard = (card) => {
    if (!card || !card.question) {
      return (
        <View style={styles.card}>
          <Text style={styles.cardText}>No question available</Text>
        </View>
      );
    }

    return (
      <View style={styles.card}>
        <Text style={styles.cardText}>{card.question}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.black} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Feather name="arrow-left" size={30} color={colors.black} />
      </TouchableOpacity>

      <Text style={styles.title}>Icebreakers</Text>

      <View style={[styles.swiperContainer, { backgroundColor: 'transparent' }]}>
        <Swiper
          cards={questions.length > 0 ? questions : [{ question: "No questions available" }]}
          renderCard={renderCard}
          onSwiped={(index) => setCardIndex(index)}
          onSwipedAll={() => console.log('All cards swiped')}
          cardIndex={cardIndex}
          backgroundColor="transparent"
          stackSize={3}
          stackSeparation={15}
          overlayLabels={{
            left: {
              title: 'Skip!',
              style: {
                label: {
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
          overlayOpacityVerticalThreshold={height / 10000}
          overlayOpacityHorizontalThreshold={width / 10000}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
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
    fontSize: 24,
    fontFamily: 'LibreBaskerville_700Bold',
    top: 65,
  },
  swiperContainer: {
    top: 60,
    right: 20,
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
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
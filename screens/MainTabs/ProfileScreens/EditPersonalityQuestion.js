// EditPersonalityQuestion.js

import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { AuthContext } from '../../../AuthProvider';
import { Feather } from '@expo/vector-icons';
import { setDoc, doc } from 'firebase/firestore';  
import { db } from '../../../firebase/firebase-config';
import { colors } from '../../../stylevars';
import * as Haptics from 'expo-haptics';


function EditPersonalityQuestion({ navigation, route }) {
  const { question, index } = route.params;
  const { userData, user } = useContext(AuthContext);

  const currentAnswer = userData.answers && userData.answers[index];
  const [selectedOption, setSelectedOption] = useState(currentAnswer);

  const handleOptionPress = async(option) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedOption(option);

    // Update userData.answers
    const updatedAnswers = new Map(Object.entries(userData.answers || {}));
    updatedAnswers.set(index, option);

    await setDoc(doc(db, 'users', user.uid), { answers: Object.fromEntries(updatedAnswers) }, { merge: true });

    navigation.goBack();
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  // Destructure labels with default values
  const [leftLabel = 'Strongly Disagree', rightLabel = 'Strongly Agree'] = question.labels || [];

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Feather name="arrow-left" size={30} color="#E83F10" />
      </TouchableOpacity>

      <Text style={styles.title}>Edit Answer</Text>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.questionText}>{question.question}</Text>
        {question.type === 'multiple' && question.options.map((option, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.optionButton,
              selectedOption === option && { borderColor: 'red' }
            ]}
            onPress={() => handleOptionPress(option)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
        {question.type === 'rating' && (
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingLabel}>{leftLabel}</Text>
            <View style={styles.buttonGrid}>
              {[...Array(10)].map((_, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.ratingButton,
                    selectedOption === idx + 1 && { borderColor: 'red' }
                  ]}
                  onPress={() => handleOptionPress(idx + 1)}
                >
                  <Text style={styles.ratingText}>{idx + 1}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[styles.ratingLabel, { textAlign: 'right', marginTop: -10 }]}>{rightLabel}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 100,
    width: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 55,
    left: 20,
    zIndex: 1,
  },
  title: {
    top: 55,
    position: 'absolute',
    color: colors.black,
    alignSelf: 'center',
    fontFamily: 'Poppins_400Regular',
    fontSize: 24,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  questionText: {
    color: colors.black,
    fontSize: 24,
    marginBottom: 10,
    fontFamily: 'Poppins_400Regular',
    alignSelf: 'center',
    paddingHorizontal: 20,
  },
  optionButton: {
    backgroundColor: 'transparent',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.black,
    width: '90%',
    alignSelf: 'center',
  },
  optionText: {
    color: colors.black,
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
    textAlign: 'center'
  },
  ratingContainer: {
    width: '90%',
    alignSelf: 'center',
  },
  ratingLabel: {
    fontFamily: 'Poppins_400Regular',
    color: colors.black,
    fontSize: 15,
    marginTop: 20,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  ratingButton: {
    width: '18%',
    height: 60,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.black,
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 8,
  },
  ratingText: {
    color: colors.black,
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
  },
});

export default EditPersonalityQuestion;
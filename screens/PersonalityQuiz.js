import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Animated, Easing } from 'react-native';
import { Feather } from '@expo/vector-icons';

function PersonalityQuizScreen({ navigation, route }) {
  const { school } = route.params;

  const questions = [
    { type: 'multiple', question: "What's your favorite color?", options: ['Red', 'Blue', 'Green'] },
    { type: 'multiple', question: "What is your favorite season?", options: ['Winter', 'Spring', 'Summer', 'Fall'] },
    { type: 'multiple', question: "Which animal do you like the most?", options: ['Dog', 'Cat', 'Bird', 'Fish'] },
    { type: 'multiple', question: "What is your favorite type of movie?", options: ['Action', 'Comedy', 'Drama', 'Horror'] },
    { type: 'multiple', question: "What genre of music do you prefer?", options: ['Pop', 'Rock', 'Classical', 'Hip-Hop'] },
    { type: 'rating', question: "How much do you enjoy social events?", min: 1, max: 10 },
    { type: 'rating', question: "How organized do you consider yourself?", min: 1, max: 10 },
    { type: 'rating', question: "How much do you like taking risks?", min: 1, max: 10 },
    { type: 'rating', question: "How comfortable are you speaking in public?", min: 1, max: 10 },
    { type: 'rating', question: "How much do you enjoy working in a team?", min: 1, max: 10 }
  ];

  const [progress, setProgress] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [buttonBorderColors, setButtonBorderColors] = useState({});
  const totalQuestions = questions.length;

  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    fadeIn(); // Start with the first question visible
  }, []);

  const fadeOut = (callback) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start(() => {
      if (callback) callback(); // Call callback when fade out is complete
    });
  };

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
      easing: Easing.in(Easing.ease),
    }).start();
  };

  const handleAnswer = (answer) => {
    const newAnswers = { ...answers, [currentQuestionIndex]: answer };
    setAnswers(newAnswers);

    if (currentQuestionIndex < totalQuestions - 1) {
      fadeOut(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setProgress((currentQuestionIndex + 1) / totalQuestions);
        fadeIn();
      });
    } else {
      console.log('Quiz completed!', newAnswers);
      navigation.navigate('QuizResultsScreen', { answers: newAnswers, school });
    }
  };

  const handleOptionPress = (index, type = 'multiple') => {
    const currentQuestion = questions[currentQuestionIndex];

    if (type === 'multiple') {
      const answer = currentQuestion.options[index];
      setAnswers({ ...answers, [currentQuestionIndex]: answer });
      setButtonBorderColors({ ...buttonBorderColors, [currentQuestionIndex]: index });
      setTimeout(() => {
        setButtonBorderColors({ ...buttonBorderColors, [currentQuestionIndex]: index });
        handleAnswer(answer);
      }, 300);
    } else if (type === 'rating') {
      const answer = index + 1;
      setAnswers({ ...answers, [currentQuestionIndex]: answer });
      setButtonBorderColors({ ...buttonBorderColors, [currentQuestionIndex]: index });
      setTimeout(() => {
        setButtonBorderColors({ ...buttonBorderColors, [currentQuestionIndex]: index });
        handleAnswer(answer);
      }, 300);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      fadeOut(() => {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
        setProgress((currentQuestionIndex - 1) / totalQuestions);
        fadeIn();
      });
    } else {
      navigation.goBack();
    }
  };

  const renderQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const selectedAnswer = answers[currentQuestionIndex];

    switch (currentQuestion.type) {
      case 'multiple':
        return (
          <View style={styles.quizQuestion}>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
            {currentQuestion.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.answerButton,
                  { borderColor: buttonBorderColors[currentQuestionIndex] === index ? 'red' : 'white' }
                ]}
                onPress={() => handleOptionPress(index, 'multiple')}
                activeOpacity={1}
              >
                <Text style={styles.answerButtonText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      case 'rating':
        return (
          <View style={styles.quizQuestion}>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
            <View style={styles.ratingContainer}>
              <Text style={{ fontFamily: 'Poppins_400Regular', color: 'white', fontSize: 15, marginTop: 20 }}>Strongly Disagree</Text>
              <View style={styles.buttonGrid}>
                {[...Array(10)].map((_, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.ratingButton,
                      { borderColor: buttonBorderColors[currentQuestionIndex] === index ? 'red' : 'white' }
                    ]}
                    onPress={() => handleOptionPress(index, 'rating')}
                    activeOpacity={1}
                  >
                    <Text style={styles.ratingButtonText}>{index + 1}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={{ fontFamily: 'Poppins_400Regular', color: 'white', fontSize: 15, marginTop: -10, textAlign: 'right' }}>Strongly Agree</Text>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Feather name="arrow-left" size={30} color="#E83F10" />
      </TouchableOpacity>

      <Text style={styles.title}>Personality</Text>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>

        {/* Wrap the question content inside Animated.View for fade animation */}
        <Animated.View style={{ opacity: fadeAnim }}>
          {renderQuestion()}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 20,
    paddingTop: 55,
  },
  backButton: {
    position: 'absolute',
    top: 55,
    left: 20,
    zIndex: 1,
  },
  progressBarContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#333333',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#a37b73',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    width: '80%',
    textAlign: 'center',
    alignSelf: 'center',
    fontFamily: 'Poppins_400Regular',
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  quizQuestion: {
    marginVertical: 20,
  },
  questionText: {
    color: '#FFFFFF',
    fontSize: 24,
    marginBottom: 10,
    fontFamily: 'Poppins_400Regular',
    alignSelf: 'center',
    paddingHorizontal: 20,
  },
  answerButton: {
    backgroundColor: 'transparent',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white', // Default color, can be dynamically changed
    width: '90%',
    alignSelf: 'center',
  },
  answerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
  },
  ratingContainer: {
    width: '90%',
    alignSelf: 'center',
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
    borderColor: 'white',
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 8,
  },
  ratingButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
  },
  ratingLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    marginVertical: 5,
  },
  textInput: {
    backgroundColor: '#333333',
    color: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    fontSize: 18,
    fontFamily: 'Poppins_400Regular',
    width: '90%',
    alignSelf: 'center',
  },
});

export default PersonalityQuizScreen;
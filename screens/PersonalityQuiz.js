import React, { useState, useEffect, useRef, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Animated, Easing } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../stylevars';
import { AuthContext } from '../AuthProvider';
import * as Haptics from 'expo-haptics';
import { setDoc,doc } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';

function PersonalityQuizScreen({ navigation, route }) {
  const { deviceID } = useContext(AuthContext);
  const { school } = route.params;

  const questions = [
    { type: 'multiple', question: "What is your ideal vacation?", options: ['Going to the mountains', 'Laying on a beach', 'Strolling through Manhattan', 'Visiting ruins'] },
    { type: 'multiple', question: "In your friend group, which role do you play?", options: ['The Planner\n(Hangout Organizer)', 'The Wild Card\n(Down for anything)', 'The Therapist\n(The go-to for advice)', 'The Quiet Observer\n(Chill but loves the group)'] },
    { type: 'multiple', question: "If your life was a fashion style, would it be:", options: ['Classic and refined', 'Trendy and expressive'] },
    { type: 'multiple', question: "What would your perfect night look like?", options: ['Planned in advance', 'Spontaneous and improvised'] },
    { type: 'multiple', question: "What genre of movies do you prefer?", options: ['Action/Adventure', 'Comedy', 'Drama', 'Horror', 'Science Fiction/Fantasy'] },
    { type: 'multiple', question: "It's a Friday night, what are you doing?", options: ['Schoolwork', 'Going out', 'Having friends over', 'Watching a movie', 'Gaming', 'Drinking alone in my room'] },
    { type: 'multiple', question: "What do you geek out about?", options: ['Science and Tech innovations', 'Art, music, creative projects', 'Movies, TV series, pop culture', 'Fitness or outdoors', 'History, culture, or philosophy'] },
    { type: 'multiple', question: "I’m a self-motivated person", options: ['Needs constant reminders', 'Motivated with a nudge', 'Only when it interests me', 'Pretty driven', 'I’m a machine'] },
    { type: 'multiple', question: "How often are you stressed", options: ['I’m always chill', 'Only when things get hectic', 'Comes and goes', 'Most days', 'I’m a stress magnet'] },
    { type: 'multiple', question: "I take risks", options: ['Play it safe', 'Only when necessary', 'Occasionally spontaneous', 'Love a good thrill', 'Daredevil!'] },
    { type: 'multiple', question: "I like to workout", options: ['Not my thing', 'When I’m in the mood', 'I try to be consistent', 'I am obsessed'] },
    { type: 'multiple', question: "How much does academic success matter to you?", options: ['Doesn’t matter to me', 'I aim to do pretty well', 'I work hard for high grades', 'It’s my top priority'] },
    { type: 'rating', question: "I’m creative", min: 1, max: 10, labels: ['Strongly Disagree', 'Strongly Agree'] },
    { type: 'rating', question: "How often do you drink?", min: 1, max: 10, labels: ['Never', 'Everyday'] },
    { type: 'rating', question: "I’m an introvert", min: 1, max: 10, labels: ['Strongly Disagree', 'Strongly Agree'] },
    { type: 'rating', question: "I enjoy spending time more", min: 1, max: 10, labels: ['In nature', 'In the city'] },
    { type: 'rating', question: "How important is having a good sense of humor to you?", min: 1, max: 10, labels: ['Not important', 'Very important'] },
    { type: 'rating', question: "I enjoy going out with friends", min: 1, max: 10, labels: ['Never', 'Almost always'] },
    { type: 'rating', question: "I enjoy politically incorrect humor", min: 1, max: 10, labels: ['Strongly Disagree', 'Strongly Agree'] },
    { type: 'rating', question: "I enjoy discussing politics/news", min: 1, max: 10, labels: ['Strongly Disagree', 'Strongly Agree'] },
    { type: 'rating', question: "How important is spirituality to you?", min: 1, max: 10, labels: ['Not important', 'Very important'] },
    { type: 'multiple', question: "How much do you usually spend when out with friends?", options: ['$ (< 15)', '$$ (15-30)', '$$$ (30+)'] },
    { type: 'multiple', question: "What menu options do you want to see at your dinner?", options: ['Meat', 'Fish', 'Vegetarian/Vegan', 'Gluten-Free'] },
    { type: 'multiple', question: "What category is your major in?", options: ['STEM', 'Humanities & Social Science', 'Business and Economics', 'Arts and Creative Disciplines', 'Other'] },
    { type: 'multiple', question: "What grade are you in?", options: ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Grad'] },
    { type: 'multiple', question: "How do you define yourself", options: ['Woman', 'Man', 'Non-binary'] },
    { type: 'multiple', question: "What is your relationship status?", options: ['Single', 'In a relationship', 'It’s complicated', 'Skip'] },
    { type: 'multiple', question: "What are you most excited to get out of joining PlateMates?", options: ['Meeting like-minded students', 'Exploring fun, new social experiences', 'Stepping out of my comfort zone', 'Building meaningful connections', 'Good laughs over food'] },
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
      duration: 200,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start(() => {
      if (callback) callback(); // Call callback when fade out is complete
    });
  };

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.in(Easing.ease),
    }).start();
  };

  const handleAnswer = async(answer) => {
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
      const answersMap = new Map(Object.entries(newAnswers));
      const answersObject = Object.fromEntries(answersMap);
      await setDoc(doc(db,'analytics',deviceID),{ answers: answersObject },{merge:true});
    }
  };

  const handleOptionPress = (index, type = 'multiple') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const currentQuestion = questions[currentQuestionIndex];

    if (type === 'multiple') {
      const answer = currentQuestion.options[index];
      setAnswers({ ...answers, [currentQuestionIndex]: answer });
      setButtonBorderColors({ ...buttonBorderColors, [currentQuestionIndex]: index });
      setTimeout(() => {
        setButtonBorderColors({ ...buttonBorderColors, [currentQuestionIndex]: index });
        handleAnswer(answer);
      }, 150);
    } else if (type === 'rating') {
      const answer = index + 1;
      setAnswers({ ...answers, [currentQuestionIndex]: answer });
      setButtonBorderColors({ ...buttonBorderColors, [currentQuestionIndex]: index });
      setTimeout(() => {
        setButtonBorderColors({ ...buttonBorderColors, [currentQuestionIndex]: index });
        handleAnswer(answer);
      }, 150);
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

  const progressAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    // Animate the progress bar whenever the progress changes
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 500, // Adjust the duration as needed
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const renderQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const selectedAnswer = answers[currentQuestionIndex];

    switch (currentQuestion.type) {
      case 'multiple':
        return (
          <View style={styles.quizQuestion}>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
            {currentQuestion.options.map((option, index) => (
              <View style={styles.shadowContainer}>
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.answerButton,
                    { borderColor: buttonBorderColors[currentQuestionIndex] === index ? colors.primary : colors.black }
                  ]}
                  onPress={() => handleOptionPress(index, 'multiple')}
                  activeOpacity={1}
                >
                  <Text style={styles.answerButtonText}>{option}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        );
      case 'rating':
        return (
          <View style={styles.quizQuestion}>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
            <View style={styles.ratingContainer}>
              <Text style={{ fontFamily: 'Poppins_400Regular', color: colors.black, fontSize: 15, marginTop: 20 }}>
                {currentQuestion.labels ? currentQuestion.labels[0] : 'Not At All'}
              </Text>
              <View style={styles.buttonGrid}>
                {[...Array(10)].map((_, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.ratingButton,
                      { borderColor: buttonBorderColors[currentQuestionIndex] === index ? colors.primary : colors.black }
                    ]}
                    onPress={() => handleOptionPress(index, 'rating')}
                    activeOpacity={1}
                  >
                    <Text style={styles.ratingButtonText}>{index + 1}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={{ fontFamily: 'Poppins_400Regular', color: colors.black, fontSize: 15, marginTop: -10, textAlign: 'right' }}>
                {currentQuestion.labels ? currentQuestion.labels[1] : 'Very Much'}
              </Text>
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
        <Feather name="arrow-left" size={30} color={colors.primary} />
      </TouchableOpacity>

      <Text style={styles.title}>Personality</Text>

      <View contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
          </View>
        </View>

        {/* Wrap the question content inside Animated.View for fade animation */}
        <Animated.View style={{ opacity: fadeAnim }}>
          {renderQuestion()}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    backgroundColor: colors.dark_grey,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.progress_bar,
  },
  title: {
    color: colors.black,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    width: '80%',
    textAlign: 'center',
    alignSelf: 'center',
    fontFamily: 'LibreBaskerville_700Bold',
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  quizQuestion: {
    marginVertical: 20,
  },
  questionText: {
    color: colors.black,
    fontSize: 24,
    marginBottom: 10,
    fontFamily: 'Poppins_400Regular',
    alignSelf: 'center',
    paddingHorizontal: 20,
  },
  answerButton: {
    backgroundColor: colors.background,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.black, // Default color, can be dynamically changed
    width: '90%',
    alignSelf: 'center',
    textAlign: 'center'
  },
  answerButtonText: {
    color: colors.black,
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
    textAlign: 'center',
    width: '110%'
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
    borderColor: colors.black,
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 8,
  },
  ratingButtonText: {
    color: colors.black,
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
  },
  ratingLabel: {
    color: colors.black,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    marginVertical: 5,
  },
  textInput: {
    backgroundColor: colors.dark_grey,
    color: colors.black,
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    fontSize: 18,
    fontFamily: 'Poppins_400Regular',
    width: '90%',
    alignSelf: 'center',
  },
  shadowContainer: {
    width: '100%',
    alignItems: 'center',
    borderRadius: 10,
    padding: 2,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,

    elevation: 5,
  },
});

export default PersonalityQuizScreen;
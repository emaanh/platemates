import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

function PersonalityQuizScreen({ navigation, route }) {
  const { school } = route.params;
  const [progress, setProgress] = useState(0.2); // Initial progress value

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Feather name="arrow-left" size={30} color="#E83F10" />
      </TouchableOpacity>

      <Text style={styles.title}>Personality</Text>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>

        <View style={styles.quizQuestion}>
          <Text style={styles.questionText}>What's your favorite color?</Text>
          <TouchableOpacity style={styles.answerButton} onPress={() => setProgress(0.4)}>
            <Text style={styles.answerButtonText}>Red</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.answerButton} onPress={() => setProgress(0.6)}>
            <Text style={styles.answerButtonText}>Blue</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.answerButton} onPress={() => setProgress(0.8)}>
            <Text style={styles.answerButtonText}>Green</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 20,
    paddingTop: 41,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  progressBarContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
    marginTop: 20
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#333333',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#a37b73'
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
  subtitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Poppins_400Regular',
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
    paddingHorizontal: 20
  },
  answerButton: {
    backgroundColor: 'transparent',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white'
  },
  answerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
  },
});

export default PersonalityQuizScreen;
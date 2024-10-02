import React, { useContext } from 'react';
import { Alert, Text, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { AuthContext } from '../../../AuthProvider';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

function EditProfile({ navigation }) {
  const { userData } = useContext(AuthContext);

  const questions = [
    { type: 'multiple', question: "What grade are you in?", field: 'grade', options: ['Freshman','Sophomore','Junior','Senior','Graduate'] },
    { type: 'multiple', question: "What is your gender?", field: 'gender', options: ['Male', 'Female', 'Other'] },
    { type: 'multiple', question: "What's your favorite color?", field: 'favoriteColor', options: ['Red', 'Blue', 'Green'] },
    { type: 'multiple', question: "What is your favorite season?", field: 'favoriteSeason', options: ['Winter', 'Spring', 'Summer', 'Fall'] },
    { type: 'multiple', question: "Which animal do you like the most?", field: 'favoriteAnimal', options: ['Dog', 'Cat', 'Bird', 'Fish'] },
    { type: 'multiple', question: "What is your favorite type of movie?", field: 'favoriteMovieGenre', options: ['Action', 'Comedy', 'Drama', 'Horror'] },
    { type: 'multiple', question: "What genre of music do you prefer?", field: 'favoriteMusicGenre', options: ['Pop', 'Rock', 'Classical', 'Hip-Hop'] },
    { type: 'rating', question: "How much do you enjoy social events?", field: 'socialEventRating', min: 1, max: 10 },
    { type: 'rating', question: "How organized do you consider yourself?", field: 'organizationRating', min: 1, max: 10 },
    { type: 'rating', question: "How much do you like taking risks?", field: 'riskTakingRating', min: 1, max: 10 },
    { type: 'rating', question: "How comfortable are you speaking in public?", field: 'publicSpeakingRating', min: 1, max: 10 },
    { type: 'rating', question: "How much do you enjoy working in a team?", field: 'teamworkRating', min: 1, max: 10 },
  ];

  const handleSave = () => {
    Alert.alert('Profile Updated', 'Your profile has been successfully updated.');
    navigation.goBack();
  };

  const handleEditField = (field, index, isPersonalityQuestion = false) => {
    if (isPersonalityQuestion) {
      const question = questions[index];
      navigation.navigate('EditPersonalityQuestion', { question, index });
    } else {
      navigation.navigate('EditField', { field, });
    }
  };
  return (
    <View style={styles.screenContainer}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Feather name="arrow-left" size={30} color="#E83F10" />
      </TouchableOpacity>

      <Text style={styles.headerText}>Profile</Text>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.editProfileContainer}>
        <Text style={styles.sectionHeader}>Basic Info</Text>

        <TouchableOpacity style={styles.rowContainer} onPress={() => alert('This field cannot be changed')}>
          <View>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.valueText}>{userData.email || 'Not set'}</Text>
          </View>
          <Feather name="chevron-right" size={24} color="#888" />
        </TouchableOpacity>
        <View style={styles.separator} />

        <TouchableOpacity style={styles.rowContainer} onPress={() => alert('This field cannot be changed')}>
          <View>
            <Text style={styles.label}>School</Text>
            <Text style={styles.valueText}>{userData.longSchool || 'Not set'}</Text>
          </View>
          <Feather name="chevron-right" size={24} color="#888" />
        </TouchableOpacity>
        <View style={styles.separator} />

        <TouchableOpacity style={styles.rowContainer} onPress={() => handleEditField('fullName')}>
          <View>
            <Text style={styles.label}>Full Name</Text>
            <Text style={styles.valueText}>{userData.fullName || 'Not set'}</Text>
          </View>
          <Feather name="chevron-right" size={24} color="#888" />
        </TouchableOpacity>
        <View style={styles.separator} />

        <TouchableOpacity style={styles.rowContainer} onPress={() => handleEditField('phone')}>
          <View>
            <Text style={styles.label}>Phone Number</Text>
            <Text style={styles.valueText}>{userData.phone || 'Not set'}</Text>
          </View>
          <Feather name="chevron-right" size={24} color="#888" />
        </TouchableOpacity>
        <View style={styles.separator} />



        <Text style={styles.sectionHeader}>Personality Info</Text>

        {/* Hardcoded Personality Info Fields */}
        {questions.map((item, index) => (
          <React.Fragment key={index}>
            <View>
              <TouchableOpacity
                style={styles.rowContainer}
                onPress={() => handleEditField(item.field, index, true)}
              >
                <View>
                  <Text style={styles.label}>{item.question}</Text>
                  <Text style={styles.valueText}>
                    {userData.answers[index]
                      ? item.type === 'rating'
                        ? userData.answers[index].toString()
                        : userData.answers[index]
                      : 'Not set'}
                  </Text>
                </View>
                <Feather name="chevron-right" size={24} color="#888" />
              </TouchableOpacity>
            </View>
            {index < questions.length - 1 && <View style={styles.separator} />}
          </React.Fragment>
        ))}
        <View style={styles.separator} />
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: 100, // Adjust as needed
    width: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 55,
    left: 20,
    zIndex: 1,
  },
  headerText: {
    top: 55,
    position: 'absolute',
    color: 'white',
    alignSelf: 'center',
    fontFamily: 'Poppins_400Regular',
    fontSize: 24,
  },
  editProfileContainer: {
    alignItems: 'center',
    paddingBottom: 20, // To ensure content is above the save button
  },
  sectionHeader: {
    alignSelf: 'flex-start',
    marginLeft: '5%',
    marginTop: 20,
    marginBottom: 10,
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  rowContainer: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  label: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#1c1c1c',
    color: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top', // For Android to align text at the top in multiline
  },
  separator: {
    width: '90%',
    height: 1,
    backgroundColor: '#444',
  },
  saveButton: {
    alignSelf: 'center',
    width: '90%',
    backgroundColor: '#E83F10',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditProfile;
import React, { useContext } from 'react';
import { Alert, Text, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { AuthContext } from '../../../AuthProvider';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../../stylevars';

function EditProfile({ navigation }) {
  const { userData } = useContext(AuthContext);

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
    { type: 'multiple', question: "Academic success matter to me", options: ['Doesn’t matter to me', 'I aim to do pretty well', 'I work hard for high grades', 'It’s my top priority'] },
    { type: 'rating', question: "I’m creative", min: 1, max: 10, labels: ['Strongly Disagree', 'Strongly Agree'] },
    { type: 'rating', question: "How often do you drink?", min: 1, max: 10, labels: ['Never', 'Everyday'] },
    { type: 'rating', question: "I’m an introvert", min: 1, max: 10, labels: ['Strongly Disagree', 'Strongly Agree'] },
    { type: 'rating', question: "I enjoy spending time more", min: 1, max: 10, labels: ['In nature', 'In the city'] },
    { type: 'rating', question: "Having a good sense of humor important to me", min: 1, max: 10, labels: ['Not important', 'Very important'] },
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
    { type: 'multiple', question: "What are you most excited to get out of joining PlateMates?", options: ['Meeting like-minded students', 'Exploring fun, new social experiences', 'Stepping out of my comfort zone', 'Building meaningful connections', 'Enjoying good laughs over food'] },
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

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={30} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.editProfileContainer}>
        <Text style={styles.sectionHeader}>Basic Info</Text>

        <TouchableOpacity style={styles.rowContainer} onPress={() => alert('This field cannot be changed')}>
          <View>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.valueText}>{userData.email || 'Not set'}</Text>
          </View>
          <Feather name="chevron-right" size={24} color={colors.black} />
        </TouchableOpacity>
        <View style={styles.separator} />

        <TouchableOpacity style={styles.rowContainer} onPress={() => alert('This field cannot be changed')}>
          <View>
            <Text style={styles.label}>School</Text>
            <Text style={styles.valueText}>{userData.longSchool || 'Not set'}</Text>
          </View>
          <Feather name="chevron-right" size={24} color={colors.black} />
        </TouchableOpacity>
        <View style={styles.separator} />

        <TouchableOpacity style={styles.rowContainer} onPress={() => handleEditField('fullName')}>
          <View>
            <Text style={styles.label}>Full Name</Text>
            <Text style={styles.valueText}>{userData.fullName || 'Not set'}</Text>
          </View>
          <Feather name="chevron-right" size={24} color={colors.black} />
        </TouchableOpacity>
        <View style={styles.separator} />

        <TouchableOpacity style={styles.rowContainer} onPress={() => handleEditField('phone')}>
          <View>
            <Text style={styles.label}>Phone Number</Text>
            <Text style={styles.valueText}>{userData.phone || 'Not set'}</Text>
          </View>
          <Feather name="chevron-right" size={24} color={colors.black} />
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
                <Feather name="chevron-right" size={24} color={colors.black} />
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
  editProfileContainer: {
    alignItems: 'center',
    paddingBottom: 20, // To ensure content is above the save button
  },
  sectionHeader: {
    alignSelf: 'flex-start',
    marginLeft: '5%',
    marginTop: 20,
    marginBottom: 10,
    color: colors.black,
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
    color: colors.black,
    fontSize: 16,
    marginBottom: 5,
  },
  valueText: {
    color: colors.dark_grey,
    fontSize: 14,
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
    color: colors.black,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditProfile;
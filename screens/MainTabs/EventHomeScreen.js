import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Ensure this is installed and linked

function EventHomeScreen() {
  const handleIcebreakerPress = () => {
    // Handle the press action, e.g., navigate to the Icebreaker Game screen
    console.log('Icebreaker Game pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Dinner Scheduled</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Icebreaker Game as a Pressable Button */}
        <TouchableOpacity style={[styles.bubble, {backgroundColor: 'rgba(0, 191, 255, 0.5)',borderColor: 'white',}]} onPress={handleIcebreakerPress}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Icebreaker Game</Text>
            <Icon name="arrow-forward" size={24} color="white" style={styles.arrowIcon} />
          </View>
        </TouchableOpacity>

        {/* Existing Content */}
        <View style={[styles.bubble, { backgroundColor: '#E83F10', borderWidth: 0 }]}>
          <Text style={[styles.bubbleText, { color: 'black' }]}>Your seat is confirmed</Text>

          <View style={styles.dateTimeContainer}>
            <Icon name="calendar-today" size={20} color="black" style={styles.icon} />
            <Text style={[styles.dateTimeText, { color: 'black' }]}>
              Wednesday, October 9, 7:00 PM
            </Text>
          </View>

          <View style={[styles.separator, { backgroundColor: 'black' }]} />

          <View style={styles.locationContainer}>
            <Icon name="location-on" size={20} color="black" style={styles.icon} />
            <Text style={[styles.locationText, { color: 'black' }]}>UC Berkeley</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, { borderColor: 'black', borderWidth: 1 }]}>
              <Text style={[styles.buttonText, { fontFamily: 'Poppins_700Bold', color: 'black' }]}>
                I will be late
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { borderColor: 'black', borderWidth: 1 }]}>
              <Text style={[styles.buttonText, { fontFamily: 'Poppins_700Bold', color: 'black' }]}>
                Reschedule
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { borderColor: 'black', borderWidth: 1 }]}>
              <Text style={[styles.buttonText, { fontFamily: 'Poppins_700Bold', color: 'black' }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Other Bubbles */}
        <View style={styles.bubble}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Your Group</Text>
          </View>
          <Text style={styles.bubbleHeader}>Find out more about your group on</Text>
          <Text
            style={[
              styles.bubbleHeader,
              { fontFamily: 'Poppins_700Bold', marginTop: 0, color: '#E83F10' },
            ]}
          >
            Tuesday, October 8 at 7:00 PM
          </Text>
        </View>

        <View style={styles.bubble}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Your Restaurant</Text>
          </View>
          <Text style={styles.bubbleHeader}>Find out more about your group on</Text>
          <Text
            style={[
              styles.bubbleHeader,
              { fontFamily: 'Poppins_700Bold', marginTop: 0, color: '#E83F10' },
            ]}
          >
            Tuesday, October 8 at 7:00 PM
          </Text>
        </View>

        <View style={styles.bubble}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Your Dinner</Text>
          </View>
          <Text style={styles.bubbleHeader}>Find out more about your group on</Text>
          <Text
            style={[
              styles.bubbleHeader,
              { fontFamily: 'Poppins_700Bold', marginTop: 0, color: '#E83F10' },
            ]}
          >
            Tuesday, October 8 at 7:00 PM
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000000',
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 20,
    alignSelf: 'center',
    fontFamily: 'Poppins_700Bold',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  bubble: {
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginVertical: 10,
    backgroundColor: 'transparent',
    marginHorizontal: 10,
  },
  bubbleText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    fontFamily: 'Poppins_700Bold',
    marginLeft: 10,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  dateTimeText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 5,
    fontFamily: 'Poppins_400Regular',
  },
  icon: {
    // Adjust icon styles if needed
  },
  separator: {
    width: '99%',
    height: 1,
    backgroundColor: 'white',
    marginVertical: 15,
    alignSelf: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
    marginLeft: 10,
  },
  locationText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 5,
    fontFamily: 'Poppins_400Regular',
  },
  buttonContainer: {
    marginTop: 10, // Adjusted from 20 to 10 for better spacing
    width: '100%',
  },
  button: {
    backgroundColor: 'transparent',
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 5,
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins_400Regular',
  },
  bubbleHeader: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginLeft: 10,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'left',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
    justifyContent: 'space-between', // Ensure space between title and arrow
  },
  titleText: {
    color: 'white',
    fontSize: 22,
    marginLeft: 5,
    fontFamily: 'Poppins_700Bold',
  },
  arrowIcon: {
    marginRight: 5,
  },
});

export default EventHomeScreen;
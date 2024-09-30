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
import IcebreakerScreen from './IcebreakerScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { colors } from '../../stylevars';

const Stack = createStackNavigator();

function EventHub(){
  return (
    <Stack.Navigator screenOptions={{ swipeEnabled: false, headerShown: false  }}>
      <Stack.Screen
        name="EventHome"
        component={EventHomeScreen}
      />
      <Stack.Screen
        name="Icebreaker"
        component={IcebreakerScreen}
      />
    </Stack.Navigator>
  );
}


function EventHomeScreen({navigation}) {
  const handleIcebreakerPress = () => {
    navigation.navigate('Icebreaker');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Dinner Scheduled</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Icebreaker Game as a Pressable Button */}
        <TouchableOpacity style={[styles.bubble, {backgroundColor: colors.ice, borderColor: colors.white,}]} onPress={handleIcebreakerPress}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Icebreaker Game</Text>
            <Icon name="arrow-forward" size={24} color={colors.white} style={styles.arrowIcon} />
          </View>
        </TouchableOpacity>

        {/* Existing Content */}
        <View style={[styles.bubble, { backgroundColor: colors.primary, borderWidth: 0 }]}>
          <Text style={[styles.bubbleText, { color: colors.black }]}>Your seat is confirmed</Text>

          <View style={styles.dateTimeContainer}>
            <Icon name="calendar-today" size={20} color={colors.black} style={styles.icon} />
            <Text style={[styles.dateTimeText, { color: colors.black }]}>
              Wednesday, October 9, 7:00 PM
            </Text>
          </View>

          <View style={[styles.separator, { backgroundColor: colors.black }]} />

          <View style={styles.locationContainer}>
            <Icon name="location-on" size={20} color={colors.black} style={styles.icon} />
            <Text style={[styles.locationText, { color: colors.black }]}>UC Berkeley</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, { borderColor: colors.black, borderWidth: 1 }]}>
              <Text style={[styles.buttonText, { fontFamily: 'Poppins_700Bold', color: colors.black  }]}>
                I will be late
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { borderColor: colors.black, borderWidth: 1 }]}>
              <Text style={[styles.buttonText, { fontFamily: 'Poppins_700Bold', color: colors.black}]}>
                Reschedule
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { borderColor: colors.black, borderWidth: 1 }]}>
              <Text style={[styles.buttonText, { fontFamily: 'Poppins_700Bold', color: colors.black }]}>
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
              { fontFamily: 'Poppins_700Bold', marginTop: 0, color: colors.primary },
            ]}
          >
            Tuesday, October 8 at 5:00 PM
          </Text>
        </View>

        <View style={styles.bubble}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Your Restaurant</Text>
          </View>
          <Text style={styles.bubbleHeader}>Your restaurant will be revealed on </Text>
          <Text
            style={[
              styles.bubbleHeader,
              { fontFamily: 'Poppins_700Bold', marginTop: 0, color: colors.primary },
            ]}
          >
            Tuesday, October 8 at 12:00 PM
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
              { fontFamily: 'Poppins_700Bold', marginTop: 0, color: colors.primary },
            ]}
          >
            Wednesday, October 9 at 7:00 PM
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
    backgroundColor: colors.black,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    marginVertical: 10,
    alignSelf: 'center',
    fontFamily: 'Poppins_700Bold',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  bubble: {
    borderWidth: 2,
    borderColor: colors.white,
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginVertical: 10,
    backgroundColor: 'transparent',
    marginHorizontal: 10,
  },
  bubbleText: {
    color: colors.white,
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
    color: colors.white,
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
    backgroundColor: colors.white,
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
    color: colors.white,
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
    borderColor: colors.white,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins_400Regular',
  },
  bubbleHeader: {
    color: colors.white,
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
    color: colors.white,
    fontSize: 22,
    marginLeft: 5,
    fontFamily: 'Poppins_700Bold',
  },
  arrowIcon: {
    marginRight: 5,
  },
});

export default EventHub;
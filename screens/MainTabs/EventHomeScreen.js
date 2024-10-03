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
    <Stack.Navigator screenOptions={{ gestureEnabled: false, swipeEnabled: false, headerShown: false  }}>
      <Stack.Screen
        name="EventHome"
        component={EventHomeScreen}xr
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

      <View style={styles.divider} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Icebreaker Game as a Pressable Button */}
        <TouchableOpacity style={[styles.bubbleIceBreaker, {backgroundColor: colors.ice, borderColor: colors.black,}]} onPress={handleIcebreakerPress}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Icebreaker Game</Text>
            <Icon name="arrow-forward" size={24} color={colors.black} style={styles.arrowIcon} />
          </View>
        </TouchableOpacity>

        {/* Existing Content */}
        <View style={[styles.bubble, { backgroundColor: colors.primary, borderWidth: 0 }]}>
          <Text style={[styles.bubbleText, { color: colors.background }]}>Your seat is confirmed</Text>

          <View style={styles.dateTimeContainer}>
            <Icon name="calendar-today" size={20} color={colors.background} style={styles.icon} />
            <Text style={[styles.dateTimeText, { color: colors.background }]}>
              Wednesday, October 9, 7:00 PM
            </Text>
          </View>

          <View style={[styles.separator, { backgroundColor: colors.background }]} />

          <View style={styles.locationContainer}>
            <Icon name="location-on" size={20} color={colors.background} style={styles.icon} />
            <Text style={[styles.locationText, { color: colors.background }]}>UC Berkeley</Text>
          </View>

          <View style={styles.buttonContainer}>
            <View style={styles.shadowContainer}>
              <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary, borderColor: colors.background, borderWidth: 1 }]}>
                <Text style={[styles.buttonText, { fontFamily: 'Poppins_700Bold', color: colors.background  }]}>
                  I will be late
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.shadowContainer}>
              <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary, borderColor: colors.background, borderWidth: 1 }]}>
                <Text style={[styles.buttonText, { fontFamily: 'Poppins_700Bold', color: colors.background}]}>
                  Reschedule
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.shadowContainer}>
              <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary, borderColor: colors.background, borderWidth: 1 }]}>
                <Text style={[styles.buttonText, { fontFamily: 'Poppins_700Bold', color: colors.background }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
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
    backgroundColor: colors.background,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.black,
    marginVertical: 10,
    alignSelf: 'center',
    fontFamily: 'LibreBaskerville_700Bold',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  bubble: {
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginVertical: 10,
    backgroundColor: 'transparent',
    marginHorizontal: 10,
  },
  bubbleIceBreaker: {
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginVertical: 10,
    backgroundColor: 'transparent',
    marginHorizontal: 10,
  },
  bubbleText: {
    color: colors.black,
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
    color: colors.black,
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
    backgroundColor: colors.black,
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
    color: colors.black,
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
    borderColor: colors.black,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins_400Regular',
  },
  shadowContainer: {
    borderRadius: 10,
    padding: 2,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,

    elevation: 5,
  },
  bubbleHeader: {
    color: colors.black,
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
    color: colors.black,
    fontSize: 22,
    marginLeft: 5,
    fontFamily: 'Poppins_700Bold',
  },
  arrowIcon: {
    marginRight: 5,
  },
  divider: {
    height: 0.5, // Thin line
    width: '110%',
    alignSelf: 'center',
    backgroundColor: colors.grey,
    marginHorizontal: 20,
  },
});

export default EventHub;
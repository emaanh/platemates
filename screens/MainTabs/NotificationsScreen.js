import React, { useContext, useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { colors } from '../../stylevars';
import { AuthContext } from '../../AuthProvider';
import { db } from '../../firebase/firebase-config';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

// Helper function to calculate time since the timestamp
const formatTimeSince = (timestamp) => {
  const now = new Date();
  const then = timestamp instanceof Date ? timestamp : timestamp.toDate();
  const diffInSeconds = Math.floor((now - then) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w`;
  }

  const diffInMonths = Math.floor(diffInWeeks / 4);
  if (diffInMonths < 12) {
    return `${diffInMonths}mo`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears}y`;
};

function NotificationsScreen() {
  const { notifications } = useContext(AuthContext);

  // Render each notification item
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.notificationTitle}>{item.title}</Text>
      <Text style={styles.notificationDescription}>
        {item.description}{' '}
        <Text style={styles.notificationTime}>
          {formatTimeSince(item.timestamp)}
        </Text>
      </Text>
    </TouchableOpacity>
  );

  // Render when the FlatList is empty
  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Feather name="bell" size={50} color={colors.black} />
      <Text style={styles.emptyText}>No Notifications</Text>
    </View>
  );

  return (
    <View style={styles.screenContainer}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
      <View style={styles.divider} />

      {/* Notifications List */}
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id || item.title}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={
          notifications.length === 0 && styles.flatListEmpty
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background, // Black background
  },
  header: {
    paddingTop: 70, // Adjust for status bar height
    paddingBottom: 10,
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  headerTitle: {
    color: colors.black,
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'LibreBaskerville_700Bold',
  },
  divider: {
    height: 0.5, // Thin line
    width: '110%',
    alignSelf: 'center',
    backgroundColor: colors.grey,
    marginHorizontal: 20,
    marginBottom: 2.5,
  },
  button: {
    backgroundColor: 'transparent',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'flex-start', // Align text to the left
    borderWidth: 1,
    borderColor: colors.black, // White border
    width: '90%',
    alignSelf: 'center',
  },
  notificationTitle: {
    color: colors.black,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    fontFamily: 'Poppins_700Bold',
  },
  notificationDescription: {
    fontFamily: 'Poppins_400Regular',
    color: colors.black,
    fontSize: 16,
  },
  notificationTime: {
    color: colors.grey, // Light grey color for timestamp
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50, // Space from the top
  },
  emptyText: {
    color: colors.black,
    fontSize: 20,
    marginTop: 10,
  },
  flatListEmpty: {
    flexGrow: 1, // Ensures the empty component is centered vertically
    justifyContent: 'center',
  },
});

export default NotificationsScreen;
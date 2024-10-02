import React, { useState } from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { colors } from '../../stylevars';

function NotificationsScreen() {

  const [notifications, setNotifications] = useState([
    // { id: '1', title: 'Your order has been shipped!' },
    // { id: '2', title: 'New message from John Doe' },
    // { id: '3', title: 'Your password was changed successfully' },
  ]);

  // Render each notification item
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.notificationText}>{item.title}</Text>
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
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'LibreBaskerville_700Bold',
  },
  divider: {
    height: 0.5, // Thin line
    width: '110%',
    alignSelf: 'center',
    backgroundColor: colors.grey,
    marginHorizontal: 20,
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
  notificationText: {
    color: colors.black,
    fontSize: 18,
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
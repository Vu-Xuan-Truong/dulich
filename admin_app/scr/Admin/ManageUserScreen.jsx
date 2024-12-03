import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore'; // Correct Firestore imports
import { firestore } from '../../firebase/firebase'; // Import Firestore from your firebase config
import Icon from 'react-native-vector-icons/FontAwesome';

const ManageUserScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch all users
    const fetchUsers = async () => {
      try {
        const userSnapshot = await getDocs(collection(firestore, 'users')); // Fetch users from Firestore
        const usersList = userSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList);
        setFilteredUsers(usersList); // Initialize filteredUsers with all users
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Handle search filter by username
  const handleSearch = (text) => {
    setSearchTerm(text);
    if (text) {
      const filtered = users.filter((user) =>
        user.name?.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users); // If search term is empty, reset filtered users
    }
  };

  // Handle Deleting a User
  const handleDeleteUser = async (userId) => {
    Alert.alert(
      'Xác nhận',
      'Xóa người dùng này?',
      [
        {
          text: 'Bỏ qua',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          onPress: async () => {
            try {
              await deleteDoc(doc(firestore, 'users', userId)); // Delete user from Firestore
              const updatedUsers = users.filter((user) => user.id !== userId);
              setUsers(updatedUsers);
              setFilteredUsers(updatedUsers); // Update filtered users list
            } catch (error) {
              console.error('Error deleting user:', error);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin - Người dùng</Text>

      {/* Search input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm người dùng..."
        value={searchTerm}
        onChangeText={handleSearch}
      />

      {/* Display list of users */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('EditUserAD', { userId: item.id })}>
              {/* Display user avatar */}
              <Image
                // source={{ uri: item.profileImageUrl || 'https://via.placeholder.com/50' }}
                source={item.profileImageUrl ? { uri: item.profileImageUrl } : require('../../config/assets/avatar-trang-1.png')}
                style={styles.avatar}
              />
            </TouchableOpacity>
            <View style={styles.userInfo}>
              <Text style={styles.userName} onPress={() => navigation.navigate('EditUserAD', { userId: item.id })}>{item.name}  </Text>
            </View>

            <TouchableOpacity onPress={() => handleDeleteUser(item.id)}>
              <Icon name="trash" size={24} color="red" style={styles.deleteIcon} />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
    borderRadius: 5,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteIcon: {
    marginLeft: 'auto', // Push icon to the right
  },
});

export default ManageUserScreen;

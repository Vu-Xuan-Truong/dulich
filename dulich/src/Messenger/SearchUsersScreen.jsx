import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const SearchUsersScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const currentUser = auth().currentUser;

  useEffect(() => {
    const fetchUsers = async () => {
      if (search.trim()) {
        const querySnapshot = await firestore()
          .collection('users')
          .where('name', '>=', search)
          .where('name', '<=', search + '\uf8ff')
          .get();

        const usersList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUsers(usersList);
      } else {
        setUsers([]);
      }
    };

    fetchUsers();
  }, [search]);

  const navigateToChat = (user) => {
    const chatId = currentUser.uid > user.id ? `${currentUser.uid}_${user.id}` : `${user.id}_${currentUser.uid}`;
    navigation.navigate('ChatScreen', { chatId, userId: user.id, userName: user.name });
  };

  const handleChatbotChat = () => {
    navigation.navigate('ChatbotScreen', { chatId: 'chatbot', userName: 'ChatGPT', userId: 'chatbot' });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm cuộc trò chuyện..."
        value={search}
        onChangeText={setSearch}
      />
      {search.toLowerCase() === 'chatbot' ? (
        <TouchableOpacity onPress={handleChatbotChat} style={styles.chatbotButton}>
          <Text style={styles.userName}>Chat with ChatBot</Text>
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity onPress={handleChatbotChat} style={styles.chatbotButton}>
            <Text style={styles.userName}>Chat with ChatBot</Text>
          </TouchableOpacity>
          <FlatList
            data={users}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigateToChat(item)} style={styles.userItem}>
                <Image
                  source={{ uri: item.profileImageUrl }}
                  style={styles.avatar}
                />
                <Text style={styles.userName}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 10,
  },
  searchInput: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 25,
    marginBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 5,
    elevation: 2,
  },
  userName: {
    fontSize: 18,
    marginLeft: 10,
    color: '#333',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ddd',
  },
  chatbotButton: {
    padding: 15,
    backgroundColor: '#e1f5fe', // Light blue background for the chatbot button
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10, // Add some space below the chatbot button
  },
});

export default SearchUsersScreen;

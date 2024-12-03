import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, Button, KeyboardAvoidingView } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker'; // Import Image Picker
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Video from 'react-native-video';
import { styles } from '../layput/Massenger/layoutChat';
import {
  fetchMessages,
  fetchUsers,
  sendMessageToChat,
  updateLastMessage,
  uploadMediaToStorage,
} from '../services/Massenger/chatService';
import auth from '@react-native-firebase/auth';

const ChatScreen = ({ route }) => {
  const { chatId, userId } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState({});
  const currentUser = auth().currentUser;
  const navigation = useNavigation();
  const flatListRef = useRef(null);

  useEffect(() => {
    const unsubscribeMessages = fetchMessages(chatId, setMessages);
    const unsubscribeUsers = fetchUsers(setUsers);

    return () => {
      unsubscribeMessages();
      unsubscribeUsers();
    };
  }, [chatId]);

  // Function to send message and scroll down
  const sendMessage = async (content, type = 'text') => {
    if (content.trim() || type !== 'text') {
      setNewMessage(''); // Clear input for text messages
      await sendMessageToChat(chatId, currentUser.uid, content, type);
      await updateLastMessage(chatId, currentUser.uid, userId, content);
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  const selectMedia = async () => {
    const options = {
      mediaType: 'mixed', // Allow both image and video
      selectionLimit: 1,
    };

    const result = await launchImageLibrary(options);
    if (result.assets && result.assets.length > 0) {
      const file = result.assets[0];
      const uploadedUrl = await uploadMediaToStorage(file, chatId);
      if (uploadedUrl) {
        const type = file.type.startsWith('image/') ? 'image' : 'video';
        sendMessage(uploadedUrl, type);
      }
    }
  };

  const getRecipient = () => {
    return users[userId] || {};
  };

  const renderMessage = ({ item }) => {
    const user = users[item.senderId] || {};
    const isCurrentUser = item.senderId === currentUser.uid;
    const openMediaViewer = () => {
      navigation.navigate('MediaViewer', { mediaUrl: item.content, mediaType: item.type });
    };  
    return (
      <View style={[styles.messageContainer, isCurrentUser ? styles.sentMessage : styles.receivedMessage]}>
        {user.profileImageUrl && <Image source={{ uri: user.profileImageUrl }} style={styles.avatar} />}
        <View style={styles.messageContent}>
          <Text style={styles.userName}>{user.name}</Text>
          {item.type === 'text' && <Text style={styles.messageText}>{item.content}</Text>}
        {item.type === 'image' && (
          <TouchableOpacity onPress={openMediaViewer}>
            <Image source={{ uri: item.content }} style={styles.imageMessage} />
          </TouchableOpacity>
        )}
        {item.type === 'video' && (
          <TouchableOpacity onPress={openMediaViewer}>
            <Video
              source={{ uri: item.content }}
              style={styles.videoMessage}
              resizeMode="cover"
              muted
            />
          </TouchableOpacity>
        )}
          <Text style={styles.timestamp}>{item.createdAt?.toDate().toLocaleTimeString()}</Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
          <Icon name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        {getRecipient().profileImageUrl && (
          <Image source={{ uri: getRecipient().profileImageUrl }} style={styles.recipientAvatar} />
        )}
        <Text style={styles.recipientName}>{getRecipient().name}</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập tin nhắn..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <Button title="Gửi" onPress={() => sendMessage(newMessage)} />
        <TouchableOpacity onPress={selectMedia} style={styles.mediaButton}>
          <Icon name="image" size={20} color="black" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

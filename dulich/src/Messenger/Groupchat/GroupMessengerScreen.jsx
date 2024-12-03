import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, Button, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker'; // Thêm thư viện để chọn ảnh/video
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from '../../layput/Massenger/layoutGroupchat';
import {
  fetchMessages,
  fetchUsers,
  sendMessageToChat,
  updateLastMessage,
  fetchGroupInfo,
  addUserToGroup,
  uploadMediaToStorage,
} from '../../services/Massenger/groupmessengerServices';
import auth from '@react-native-firebase/auth';

const GrMessScreen = ({ route }) => {
  const { chatId, userId } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState({});
  const [groupInfo, setGroupInfo] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const currentUser = auth().currentUser;
  const navigation = useNavigation();
  const flatListRef = useRef(null);

  useEffect(() => {
    const unsubscribeMessages = fetchMessages(chatId, setMessages);
    const unsubscribeUsers = fetchUsers(setUsers);

    const fetchGroup = async () => {
      const groupData = await fetchGroupInfo(chatId);
      setGroupInfo(groupData);

      // Check if the current user is a member of the group
      if (groupData.members.includes(currentUser.uid)) {
        setIsMember(true);
      }
      setLoading(false);
    };
    fetchGroup();

    return () => {
      unsubscribeMessages();
      unsubscribeUsers();
    };
  }, [chatId]);

  const joinGroup = async () => {
    try {
      await addUserToGroup(chatId, currentUser.uid);
      setIsMember(true);
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  const sendMessage = async (content, type = 'text') => {
    if (content.trim() || type !== 'text') {
      setNewMessage(''); // Clear input
      await sendMessageToChat(chatId, currentUser.uid, content, type);
      await updateLastMessage(chatId, currentUser.uid, userId, content);
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  const selectMedia = async () => {
    const options = {
      mediaType: 'mixed', // Cho phép chọn ảnh hoặc video
      selectionLimit: 1,
    };

    const result = await launchImageLibrary(options);
    if (result.assets && result.assets.length > 0) {
      const file = result.assets[0];
      const uploadedUrl = await uploadMediaToStorage(file,chatId);
      if (uploadedUrl) {
        const type = file.type.startsWith('image/') ? 'image' : 'video';
        sendMessage(uploadedUrl, type);
      }
    }
  };

  const getUser = (userId) => users[userId] || {};
  const renderMessage = ({ item }) => {
    const user = getUser(item.senderId);
    const isCurrentUser = item.senderId === currentUser.uid;

    return (
      <View style={[styles.messageContainer, isCurrentUser ? styles.sentMessage : styles.receivedMessage]}>
        {user.profileImageUrl && <Image source={{ uri: user.profileImageUrl }} style={styles.avatar} />}
        <View style={styles.messageContent}>
          <Text style={styles.userName}>{user.name}</Text>
          {item.type === 'text' && <Text style={styles.messageText}>{item.content}</Text>}
          {item.type === 'image' && <Image source={{ uri: item.content }} style={styles.imageMessage} />}
          {item.type === 'video' && (
            <Video
              source={{ uri: item.content }}
              style={styles.videoMessage}
              controls
              resizeMode="cover"
            />
          )}
          <Text style={styles.timestamp}>{item.createdAt?.toDate().toLocaleTimeString()}</Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
          <Icon name="arrow-left" size={20} color="black" />
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          groupInfo && (
            <View style={styles.groupHeader}>
              <Image source={{ uri: groupInfo.imageUrl }} style={styles.groupImage} />
              <Text style={styles.groupName}>{groupInfo.name}</Text>
            </View>
          )
        )}

        <TouchableOpacity onPress={() => navigation.navigate('EditGroupChat', { groupId: chatId })}>
          <Icon name="ellipsis-v" size={20} color="black" style={styles.menuIcon} />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
      />

      {isMember ? (
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
      ) : (
        <Button title="Tham gia nhóm" onPress={joinGroup} />
      )}
    </KeyboardAvoidingView>
  );
};

export default GrMessScreen;

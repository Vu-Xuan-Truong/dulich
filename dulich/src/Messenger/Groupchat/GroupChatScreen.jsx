import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import * as ImagePicker from 'react-native-image-picker';
import { styles } from '../../layput/Massenger/creategrchatlayout';

const GroupChatScreen = ({ navigation }) => {
  const [groupName, setGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupImage, setGroupImage] = useState(null);
  const [isPublic, setIsPublic] = useState(true); // New state for group type
  const currentUserId = auth().currentUser.uid;

  // Function to search users in Firestore
  const searchUsers = async (query) => {
    if (query.trim()) {
      const usersSnapshot = await firestore()
        .collection('users')
        .where('name', '>=', query)
        .where('name', '<=', query + '\uf8ff')
        .limit(5)
        .get();

      const usersList = usersSnapshot.docs
        .filter((doc) => doc.id !== currentUserId)
        .map((doc) => ({ id: doc.id, ...doc.data() }));

      setUsers(usersList);
    } else {
      setUsers([]);
    }
  };

  // Function to toggle user selection for the group
  const toggleUserSelection = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  // Function to handle image picking
  const pickGroupImage = () => {
    ImagePicker.launchImageLibrary(
      { mediaType: 'photo', maxWidth: 300, maxHeight: 300 },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.error('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const selectedImage = response.assets[0].uri;
          setGroupImage(selectedImage);
        } else {
          console.error('Unexpected response from ImagePicker:', response);
        }
      },
    );
  };
  

  // Function to upload image to Firebase Storage
  const uploadGroupImage = async (imageUri) => {
    const imageName = `groupImages/${currentUserId}_${Date.now()}.jpg`;
    const storageRef = storage().ref(imageName);
    await storageRef.putFile(imageUri);
    const imageUrl = await storageRef.getDownloadURL();
    return imageUrl;
  };

  const createGroupChat = async () => {
    if (groupName.trim() && selectedUsers.length > 0) {
      let groupImageUrl = null;

      if (groupImage) {
        groupImageUrl = await uploadGroupImage(groupImage);
      }

      await firestore().collection('groupchats').add({
        name: groupName,
        members: [currentUserId, ...selectedUsers],
        imageUrl: groupImageUrl,
        isGroup: true,
        isPublic: isPublic, // Store group type
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      navigation.navigate('ListChatsScreen', { refresh: true });
    } else {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin !!');
    }
  };

  return (
    <View style={styles.container}>
    {/* Input for Group Name */}
    <TextInput
      placeholder="Nhập tên nhóm..."
      value={groupName}
      onChangeText={setGroupName}
      style={styles.input}
    />

    {/* Button to Pick Group Image */}
    <TouchableOpacity onPress={pickGroupImage} style={styles.pickImageButton}>
      <Text style={styles.buttonText}>Thêm ảnh nhóm</Text>
    </TouchableOpacity>

    {/* Display selected image (if any) */}
    {groupImage && (
  <Image
    source={{ uri: groupImage }} // Correct format
    style={styles.imageStyle}
  />
)}


    {/* Search Bar for User Search */}
    <TextInput
      placeholder="Thêm Người dùng..."
      value={searchQuery}
      onChangeText={(text) => {
        setSearchQuery(text);
        searchUsers(text);
      }}
      style={styles.input}
    />

    {/* List of Users (Search Results) */}
    <FlatList
  data={users}
  keyExtractor={(item, index) => `${item.id}_${index}`} // Ensure unique keys
  renderItem={({ item }) => (
    <TouchableOpacity
      style={[
        styles.userItem,
        selectedUsers.includes(item.id) && styles.selectedUserItem,
      ]}
      onPress={() => toggleUserSelection(item.id)}
    >
      <View style={styles.userRow}>
        <Image
          source={
            item.profileImageUrl
              ? { uri: item.profileImageUrl }
              : require('../../config/assets/avatar-trang-1.png')
          }
          style={styles.avatar}
        />
        <Text style={styles.userName}>{item.name}</Text>
      </View>
      {selectedUsers.includes(item.id) && (
        <Text style={styles.checkMark}>✔️</Text>
      )}
    </TouchableOpacity>
  )}
/>

      {/* Group type selection */}
      <View style={styles.groupTypeContainer}>
        <TouchableOpacity onPress={() => setIsPublic(true)} style={[styles.groupTypeButton, isPublic && styles.activeGroupType]}>
          <Text style={styles.buttonText}>Nhóm công khai</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsPublic(false)} style={[styles.groupTypeButton, !isPublic && styles.activeGroupType]}>
          <Text style={styles.buttonText}>Nhóm riêng tư</Text>
        </TouchableOpacity>
      </View>

      {/* Other UI components like group image selection, user search, user list, etc. */}

      <Button title="Tạo nhóm" onPress={createGroupChat} />
    </View>
  );
};

export default GroupChatScreen;
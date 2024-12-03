import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, TouchableOpacity, Image, Alert, Text, Modal, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import icon library
import { launchImageLibrary } from 'react-native-image-picker'; // Import image picker
import { fetchGroupData, saveChangesToGroup, removeMemberFromGroup, addUserToGroup } from '../../services/Massenger/editGrchat'; // Import backend functions
import { styles } from '../../layput/Massenger/layoutEditGrchat'; // Import styles
import auth from '@react-native-firebase/auth';  // Import Firebase authentication
import firestore from '@react-native-firebase/firestore';  

const EditGroupChatScreen = ({ route, navigation }) => {
  const { groupId } = route.params;
  const [groupName, setGroupName] = useState('');
  const [groupImage, setGroupImage] = useState(null);
  const [users, setUsers] = useState([]);
  const [isCreator, setIsCreator] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newUserModalVisible, setNewUserModalVisible] = useState(false);
  const [newUserName, setNewUserName] = useState(''); // Changed from ID to name
  const [matchingUsers, setMatchingUsers] = useState([]); // For showing matching users

  const currentUserId = auth().currentUser?.uid;

  useEffect(() => {
    fetchGroupData(groupId, setGroupName, setGroupImage, setIsCreator, setUsers, currentUserId);
  }, [groupId]);

  const pickGroupImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const uri = response.assets[0]?.uri; // Get the image URI
        setGroupImage(uri); // Set the selected image URI in the state
      }
    });
  };

  const handleSaveChanges = () => saveChangesToGroup(groupId, groupName, groupImage, navigation);

  const handleRemoveMember = async (userId) => {
    await removeMemberFromGroup(groupId, userId, setUsers);
  };

  const searchUsersByName = async (name) => {
    const querySnapshot = await firestore()
      .collection('users')
      .where('name', '>=', name)
      .where('name', '<=', name + '\uf8ff')
      .limit(10)
      .get();

    const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Filter out users already in the group
    const filteredUsers = usersList.filter(
      (user) => !users.some(groupUser => groupUser.id === user.id)
    );
    setMatchingUsers(filteredUsers);
  };

  useEffect(() => {
    if (newUserName.trim()) {
      searchUsersByName(newUserName);
    } else {
      setMatchingUsers([]); // Clear list if input is empty
    }
  }, [newUserName]);

  const handleAddUser = async (user) => {
    await addUserToGroup(groupId, user.id, setUsers, setNewUserModalVisible);
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <TextInput
        placeholder="Enter group name..."
        value={groupName}
        onChangeText={setGroupName}
        style={styles.textInput}
      />

      {/* Display Group Image */}
      <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
        {groupImage && (
          <Image
            source={{ uri: groupImage }}
            style={styles.imageStyle}
          />
        )}

        {/* Icon for Picking Group Image */}
        <TouchableOpacity onPress={pickGroupImage} style={styles.imageIcon}>
          <Icon name="photo-camera" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <Button  title="Lưu" onPress={handleSaveChanges} />

      {/* Button to Show Group Members */}
      <TouchableOpacity onPress={() => setModalVisible(true)} style={{ marginTop: 20 }}>
        <Text style={styles.buttonText}>Thành viên trong nhóm</Text>
      </TouchableOpacity>

      {/* Button to Add New Member */}
      {isCreator && (
        <TouchableOpacity onPress={() => setNewUserModalVisible(true)} style={{ marginTop: 20 }}>
          <Text style={styles.greenText}>Thêm thành viên mới</Text>
        </TouchableOpacity>
      )}

      {/* Modal to Display Group Members */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thành viên trong nhóm</Text>
            <ScrollView>
              {users.map((user) => (
                <View key={user.id} style={styles.memberItem}>
                  <View style={styles.memberRow}>
                    <Image
                      source={{ uri: user.profileImageUrl }}
                      style={styles.avatar}
                    />
                    <Text style={styles.memberName}>{user.name}</Text>
                    {isCreator && user.id !== currentUserId && (
                      <TouchableOpacity
                        onPress={() => handleRemoveMember(user.id)}
                        style={styles.removeButton}
                      >
                        <Icon name="remove-circle" size={24} color="red" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </ScrollView>
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Modal to Add New Member */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={newUserModalVisible}
        onRequestClose={() => setNewUserModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thêm thành viên mới</Text>
            <TextInput
              placeholder="Nhập tên người dùng"
              value={newUserName}
              onChangeText={setNewUserName}
              style={styles.modalTextInput}
            />
            <ScrollView>
              {matchingUsers.map(user => (
                <TouchableOpacity key={user.id} onPress={() => handleAddUser(user)} style={styles.matchingUserItem}>
                  <Image
                    source={{ uri: user.profileImageUrl }}
                    style={styles.avatar}
                  />
                  <Text style={styles.memberName}>{user.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Button title="Đóng" onPress={() => setNewUserModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default EditGroupChatScreen;

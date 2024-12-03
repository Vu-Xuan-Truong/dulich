import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from '../layput/LayoutUser/layoutEditUser';
import { useActionSheet } from '@expo/react-native-action-sheet'; // Import useActionSheet
import LocationInput from '../services/googio/LocationInput'; // Use LocationInput
import { debounce } from 'lodash';
const EditUserScreen = ({ navigation }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const { showActionSheetWithOptions } = useActionSheet(); // Use the hook
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    age: '',
    location: '', // Initialize location
    profileImageUrl: '',
  });
  const [newAvatarUri, setNewAvatarUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = auth().currentUser;

  useEffect(() => {
    if (user) {
      const userId = user.uid;
      // Fetch user data from Firestore
      firestore().collection('users').doc(userId).get()
        .then(documentSnapshot => {
          if (documentSnapshot.exists) {
            // setUserData(documentSnapshot.data());
            const data = documentSnapshot.data();
            setUserData(data);
            setSelectedLocation(data.location); // Set initial locations
          }
        });
    }
  }, []);

  const handleImagePicker = async () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300,
      quality: 0.7,
    };

    const result = await launchImageLibrary(options);

    if (result.didCancel) {
      console.log('User cancelled image picker');
    } else if (result.errorCode) {
      console.error('ImagePicker Error: ', result.errorMessage);
    } else {
      setNewAvatarUri(result.assets[0].uri);
    }
  };

  const handleDeleteAvatar = () => {
    setNewAvatarUri(null);
    setUserData({ ...userData, profileImageUrl: '' });
  };
  const handleSelectLocation = (selectedLocation) => {
    setUserData({ ...userData, location: selectedLocation.description });
  };

  const handleSave = async () => {
    setLoading(true);
    const userId = user.uid;

    try {
      let avatarUrl = userData.profileImageUrl;

      if (newAvatarUri) {
        const storageRef = storage().ref(`avatar/${userId}`);
        await storageRef.putFile(newAvatarUri);
        avatarUrl = await storageRef.getDownloadURL();
      } else if (avatarUrl === '') {
        const storageRef = storage().ref(`avatar/${userId}`);
        await storageRef.delete();
      }

      await firestore().collection('users').doc(userId).update({
        name: userData.name,
        phone: userData.phone,
        age: userData.age,
        // location: selectedLocation || userData.location, // Save updated location
        location: selectedLocation || userData.location,
        profileImageUrl: avatarUrl,
      });

      Alert.alert('Cập nhập thông tin', 'Cập nhập thông tin thành công!');
      setLoading(false);
      navigation.goBack();
    } catch {
      setLoading(false);
      Alert.alert('Lỗi', 'Cập nhật thông tin bị lỗi. Vui lòng thử lại!');
    }
  };

  const showActionSheet = () => {
    const options = ['Thay ảnh đại diện', 'Xóa ảnh đại diện', 'Hủy'];
    const cancelButtonIndex = 2;
    const destructiveButtonIndex = 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          handleImagePicker();
        } else if (buttonIndex === 1) {
          handleDeleteAvatar();
        }
      }
    );
  };

  const handleLocationChange = debounce((input) => {
    setLocation(input);
  }, 500); // 500ms debounce time

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="#000" />
          <Text style={styles.backButtonText}>Trở về</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Cập nhập thông tin cá nhân</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            {/* Avatar Picker */}
            <TouchableOpacity onPress={showActionSheet} style={styles.avatarContainer}>
              <Image
                source={
                  newAvatarUri
                    ? { uri: newAvatarUri }
                    : userData.profileImageUrl
                      ? { uri: userData.profileImageUrl }
                      : require('../config/assets/avatar-trang-1.png')
                }
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.editIcon} onPress={showActionSheet}>
                <Icon name="edit" size={20} color="#000" />
              </TouchableOpacity>
            </TouchableOpacity>

            {/* Input Fields */}
            <TextInput
              style={styles.input}
              placeholder="Họ và Tên"
              value={userData.name}
              onChangeText={(text) => setUserData({ ...userData, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Số điện thoại"
              keyboardType="phone-pad"
              value={userData.phone}
              onChangeText={(text) => setUserData({ ...userData, phone: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Tuổi"
              keyboardType="numeric"
              value={userData.age}
              onChangeText={(text) => setUserData({ ...userData, age: text })}
            />

            {/* Replace Address Input with LocationInput */}
            {/* <LocationInputtruong1
              selectedLocation={selectedLocation}
              setSelectedLocation={handleSelectLocation}
            /> */}
      <LocationInput
        value={selectedLocation} // Pass initial value
        onSelectLocation={(location) => setSelectedLocation(location.description)} // Update location
        onChangeText={handleLocationChange} // Pass the debounced function
      />
            {/* Save Button */}
            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Lưu Thông tin</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default EditUserScreen;

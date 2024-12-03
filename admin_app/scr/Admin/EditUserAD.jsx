import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, Button, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from '../../firebase/firebase';
import * as ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importing the icon library

const EditUserAD = ({ route, navigation }) => {
  const userId = route?.params?.userId || null;
  const [userData, setUserData] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDocRef = doc(firestore, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          setName(data.name || '');
          setEmail(data.email || '');
          setAge(data.age || '');
          setPhone(data.phone || '');
          setLocation(data.location || '');
          setPassword(data.password || '');
          setProfileImageUrl(data.profileImageUrl || '');
        } else {
          console.log("No such user!");
        }
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    };

    fetchUser();
  }, [userId]);

  const handleSelectImage = async () => {
    const result = await ImagePicker.launchImageLibrary({ mediaType: 'photo' });
    if (result.assets) {
      const selectedImage = result.assets[0].uri;
      setProfileImageUrl(selectedImage);
    }
  };

  const uploadImage = async (imageUri) => {
    const fileName = imageUri.substring(imageUri.lastIndexOf('/') + 1);
    const storageRef = ref(storage, `avatar/${userId}`);
    const img = await fetch(imageUri);
    const imgBlob = await img.blob();
    await uploadBytes(storageRef, imgBlob);
    return await getDownloadURL(storageRef);
  };

  const handleUpdateUser = async () => {
    setLoading(true);
    try {
      let imageUrl = profileImageUrl;
      if (imageUrl !== userData.profileImageUrl) {
        imageUrl = await uploadImage(imageUrl);
      }

      const updates = {
        name,
        email,
        age,
        phone,
        location,
        profileImageUrl: imageUrl,
      };

      if (password) {
        updates.password = password; // Make sure to handle password securely
      }

      const userDocRef = doc(firestore, 'users', userId);
      await updateDoc(userDocRef, updates);

      Alert.alert('Success', 'User information has been updated');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating user: ', error);
      Alert.alert('Error', 'Failed to update user information');
    } finally {
      setLoading(false);
    }
  };

  if (!userData) {
    return <ActivityIndicator size="large" color="#0000ff" />; // Show loading indicator
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chỉnh sửa người dùng</Text>

      <TouchableOpacity onPress={handleSelectImage}>
        <Image
          // source={{ uri: profileImageUrl || 'https://via.placeholder.com/100' }}
          source={profileImageUrl ? { uri: profileImageUrl } : require('../../config/assets/avatar-trang-1.png')}
          style={styles.avatar}
        />
        <Text style={styles.imageText}>chọn hình ảnh</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, { flex: 1 }]} // Make input take up available space
          placeholder="New Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword} // Toggle password visibility
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon name={showPassword ? "visibility-off" : "visibility"} size={24} color="#007bff" />
        </TouchableOpacity>
      </View>

      <Button title="Update User" onPress={handleUpdateUser} disabled={loading} />
      {loading && <ActivityIndicator size="small" color="#0000ff" style={styles.loading} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 20,
  },
  imageText: {
    textAlign: 'center',
    color: '#007bff',
    marginBottom: 20,
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  loading: {
    marginTop: 20,
  },
});

export default EditUserAD;

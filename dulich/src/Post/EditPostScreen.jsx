import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Video from 'react-native-video'; // Import the Video component
import { uploadFile, fetchCategories } from '../services/Post/addNewPostBackend';
import { editPost } from '../services/Post/EditPost'; // Import hàm editPost
import { launchImageLibrary } from 'react-native-image-picker';
import { styles } from '../layput/layoutPots/layoutAddnew';
import LocationInput from '../services/googio/LocationInput'; // Import LocationInput
import { debounce } from 'lodash';
const EditPostScreen = ({ route, navigation }) => {
  const { postId, initialContent, initialLocation, initialMediaUris, initialCategory } = route.params;

  const [content, setContent] = useState(initialContent);
  const [location, setLocation] = useState(initialLocation);
  const [mediaUris, setMediaUris] = useState(initialMediaUris || []);
  const [uploading, setUploading] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || '');

  useEffect(() => {
    const fetchAndSetCategories = async () => {
      const categoryList = await fetchCategories();
      setCategories(categoryList);
    };

    fetchAndSetCategories();
  }, []);

  const selectMedia = () => {
    launchImageLibrary({ mediaType: 'mixed', selectionLimit: 0 }, response => {
      if (response.didCancel) {
        console.log('User canceled image picker');
        return;
      }

      if (response.errorCode) {
        console.error('Error with image picker: ', response.errorMessage);
        Alert.alert('Error', response.errorMessage || 'Something went wrong with the image picker.');
        return;
      }

      if (response.assets && response.assets.length > 0) {
        const selectedUris = response.assets.map(asset => asset.uri);
        setMediaUris([...mediaUris, ...selectedUris]);
      } else {
        console.log('No assets returned from image picker');
      }
    });
  };

  const removeMedia = (uri) => {
    setMediaUris(mediaUris.filter(item => item !== uri));
  };

  const handleEdit = async () => {
    if (!selectedCategory) {
      Alert.alert('Error', 'Please select a category.');
      return;
    }

    setLoadingPost(true);
    setUploading(true);

    // Upload new media files
    const newMediaUris = mediaUris.filter(uri => uri.startsWith('file://')); // Chỉ upload file mới
    const uploadedMediaUrls = await uploadFile(newMediaUris, true);

    // Combine new and existing media URLs
    const finalMediaUrls = [
      ...mediaUris.filter(uri => !uri.startsWith('file://')), // Các URL cũ
      ...uploadedMediaUrls, // Các URL mới upload
    ];

    // Update the post in Firestore
    const result = await editPost(postId, content, location, finalMediaUrls, selectedCategory);

    if (result.success) {
      Alert.alert('Thành công!', 'Đã chỉnh sửa bài viết.');
      navigation.goBack();
    } else {
      Alert.alert('Error', result.message);
    }

    setLoadingPost(false);
    setUploading(false);
  };
  const handleLocationChange = debounce((input) => {
    setLocation(input);
  }, 500); // 500ms debounce time

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chỉnh sửa bài viết</Text>

      <TextInput
        placeholder="Cảm nghĩ của bạn"
        style={styles.input}
        value={content}
        onChangeText={setContent}
        multiline={true}
      />

      {/* Thay thế TextInput nhập địa chỉ bằng LocationInput */}
      <LocationInput
        value={location}
        onSelectLocation={(selectedLocation) => setLocation(selectedLocation.description)}
        onChangeText={handleLocationChange} // Pass the debounced function
      />


      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Danh sách danh mục" value="" />
          {categories.map(category => (
            <Picker.Item key={category.id} label={category.name} value={category.name} />
          ))}
        </Picker>
      </View>

      <ScrollView horizontal style={styles.mediaContainer}>
        {mediaUris.map((uri, index) => (
          <View key={index} style={styles.imageWrapper}>
            {uri.endsWith('.mp4') || uri.endsWith('.mov') ? ( // Check if it's a video
              <Video
                source={{ uri }}
                style={styles.video}
                resizeMode="cover"
                paused={true} // Set to paused by default
              />
            ) : (
              <Image source={{ uri }} style={styles.image} />
            )}
            <TouchableOpacity onPress={() => removeMedia(uri)} style={styles.removeButton}>
              <Text style={styles.removeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity onPress={selectMedia} style={styles.selectButton}>
        <Text style={styles.selectButtonText}>Thêm hình ảnh/Video</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.submitButton, uploading && styles.disabledButton]}
        onPress={handleEdit}
        disabled={uploading}
      >
        <Text style={styles.submitButtonText}>
          {loadingPost ? <ActivityIndicator color="#fff" /> : (uploading ? 'Uploading...' : 'Lưu thay đổi')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditPostScreen;

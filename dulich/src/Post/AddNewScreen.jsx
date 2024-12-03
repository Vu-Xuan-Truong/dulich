import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Video from 'react-native-video';
import { uploadFile, addNewPostToFirestore, fetchCategories } from '../services/Post/addNewPostBackend';
import { launchImageLibrary } from 'react-native-image-picker';
import { styles } from '../layput/layoutPots/layoutAddnew';
import LocationInput from '../services/googio/LocationInput'; // Import LocationInput
import { debounce } from 'lodash';
const AddNewScreen = ({ navigation }) => {
  const [content, setContent] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null); // Địa chỉ đã chọn
  const [mediaUris, setMediaUris] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchAndSetCategories = async () => {
      const categoryList = await fetchCategories();
      setCategories(categoryList);
    };

    fetchAndSetCategories();
  }, []);

  const selectMedia = () => {
    launchImageLibrary({ mediaType: 'mixed', selectionLimit: 0 }, response => {
      if (!response.didCancel && !response.error) {
        const selectedUris = response.assets.map(asset => asset.uri);
        setMediaUris([...mediaUris, ...selectedUris]);
      }
    });
  };

  const removeMedia = (uri) => {
    setMediaUris(mediaUris.filter(item => item !== uri));
  };

  const handlePost = async () => {
    if (!selectedCategory) {
      Alert.alert('Lỗi', 'Hãy chọn một danh mục.');
      return;
    }
    if (!selectedLocation) {
      Alert.alert('Lỗi', 'Hãy chọn một địa điểm.');
      return;
    }

    setLoadingPost(true);
    setUploading(true);

    const mediaUrls = await uploadFile(mediaUris, true);

    if (mediaUrls.length > 0) {
      await addNewPostToFirestore(content, selectedLocation.description, mediaUrls, selectedCategory);
      Alert.alert('Thành công!', 'Đã đăng bài viết mới');
      navigation.goBack();
    } else {
      Alert.alert('Lỗi', 'Không thể đăng tải bài viết.');
    }

    setLoadingPost(false);
    setUploading(false);
  };
  const handleLocationChange = debounce((input) => {
    setLocation(input);
  }, 500); // 500ms debounce time
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bài viết mới</Text>

      <TextInput
        placeholder="Cảm nghĩ của bạn"
        style={styles.input}
        value={content}
        onChangeText={setContent}
        multiline
      />
      <LocationInput
        onSelectLocation={(location) => setSelectedLocation(location)} //Nhập địa chỉ
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
            {uri.endsWith('.mp4') || uri.endsWith('.mov') ? (
              <Video 
                source={{ uri }} 
                style={styles.video} 
                resizeMode="cover" 
                paused={true} 
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
        onPress={handlePost}
        disabled={uploading}
      >
        <Text style={styles.submitButtonText}>
          {loadingPost ? <ActivityIndicator color="#fff" /> : (uploading ? 'Uploading...' : 'Đăng bài')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddNewScreen;

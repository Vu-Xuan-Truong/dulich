import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Image, Pressable, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { searchPosts, searchUsers, fetchUser, searchCategories, handleSavePost, handleLike } from '../services/Search/searchService';
import { styles } from '../layput/LayoutHome/layoutSearch';
import { Picker } from '@react-native-picker/picker';
import Video from 'react-native-video';
import TruncatedText from '../services/multipurpose/TruncatedText'; // Make sure this is a component that truncates long text

const SearchScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [noResults, setNoResults] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [refreshing, setRefreshing] = useState(false); // for pull-to-refresh functionality
  const [savedPosts, setSavedPosts] = useState([]);

  useEffect(() => {
    const getUserData = async () => {
      const userData = await fetchUser();
      if (userData) {
        setUser(userData);
      }
    };
    getUserData();

    const fetchCategoriesData = async () => {
      const categoryList = await searchCategories();
      console.log('Fetched categories:', categoryList);
      setCategories(categoryList);
    };
    
  }, []);

  useEffect(() => {
    if (searchText.startsWith('@')) {
      searchForUsers(searchText.slice(1));
    } else {
      searchForPosts(searchText, selectedCategory);
    }
  }, [searchText, selectedCategory]);
  

  const formatDate = (timestamp) => {
    if (timestamp && timestamp.toDate) {
      const postDate = timestamp.toDate();
      const now = new Date();
      const diffInMilliseconds = now - postDate;
      const diffInHours = diffInMilliseconds / (1000 * 60 * 60);

      if (diffInHours < 24) {
        return `${postDate.getHours()}:${postDate.getMinutes().toString().padStart(2, '0')}`;
      } else {
        return `${postDate.getDate()}/${postDate.getMonth() + 1}/${postDate.getFullYear()}`;
      }
    }
    return '';
  };
  const searchForPosts = async (keyword) => {
    const posts = await searchPosts(keyword, selectedCategory);
    setFilteredPosts(posts);
    setNoResults(posts.length === 0);
  };

  const searchForUsers = async (keyword) => {
    const users = await searchUsers(keyword);
    setFilteredUsers(users);
    setNoResults(users.length === 0);
  };

  const onLikePost = async (postId) => {
    const currentUser = auth().currentUser;
    if (!currentUser) {
      console.error('Người dùng chưa đăng nhập.');
      return;
    }

    await handleLike(postId, currentUser.uid);
  };
  const onSavePost = async (postId) => {
    const currentUser = auth().currentUser;
    if (!currentUser) {
      console.error('Người dùng chưa đăng nhập.');
      return;
    }

    await handleSavePost(postId, currentUser.uid);
  };


  const deletePost = async (postId) => {
    Alert.alert(
      "Delete Post",
      "Bạn muốn xóa bài viết không?",
      [
        { text: "Bỏ qua", style: "cancel" },
        {
          text: "Xóa", style: "destructive", onPress: async () => {
            await firestore().collection('posts').doc(postId).delete();
            setPosts(posts.filter(post => post.id !== postId));
            alert('Đã xóa');
          }
        }
      ],
      { cancelable: true }
    );
  };

  const goToUserProfile = (userId) => {
    navigation.navigate('UserProfile', { userId });
  };

  const goToComments = (postId) => {
    navigation.navigate('Comments', { postId });
  };

  const openMediaViewer = (mediaUrl, mediaType) => {
    navigation.navigate('MediaViewer', { mediaUrl, mediaType });
  };

  const handleSharePost = async (postId, description) => {
    try {
      const url = `myapp://comments/${postId}`;
      await Share.share({
        message: `Check out this post: ${description}. Tap here to view comments: ${url}`,
      });
    } catch (error) {
      alert(error.message);
    }
  };



  const onRefresh = async () => {
    setRefreshing(true);
    await searchForPosts(searchText); // Refetch posts
    setRefreshing(false);
  };
  const handleCategoryChange = (itemValue) => {
    setSelectedCategory(itemValue);
    // Lọc lại các bài viết sau khi chọn danh mục
    searchForPosts(searchText); // Gọi lại hàm tìm kiếm để cập nhật bài viết
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
        <Icon name="arrow-left" size={20} color="#000" />
        <Text style={styles.backButtonText}>Trở về</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm địa điểm hoặc tên người dùng (nhập @ trước tên người dùng)"
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />
  {/* Lọc danh mục ngay dưới thanh tìm kiếm
  <View style={styles.categoryContainer}>
        <Text style={styles.categoryText}>Chọn danh mục:</Text>
        <Picker
          selectedValue={selectedCategory}
          style={styles.categoryPicker}
          // onValueChange={(itemValue) => setSelectedCategory(itemValue)}
          onValueChange={handleCategoryChange} // Gọi lại hàm xử lý
        >
          <Picker.Item label="Tất cả danh mục" value={null} />
          {categories.map((category) => (
            <Picker.Item key={category.id} label={category.name} value={category.id} />
          ))}
        </Picker>
      </View> */}

      {/* Hiển thị danh sách người dùng khi tìm kiếm với @ */}
      {searchText.startsWith('@') && filteredUsers.length > 0 && (
        <FlatList
          data={filteredUsers}
          // keyExtractor={(item) => item.id}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => goToUserProfile(item.id)} style={styles.userInfo}>
              <Image
                source={item.profileImageUrl ? { uri: item.profileImageUrl } : require('../config/assets/avatar-trang-1.png')}
                style={styles.avatar}
              />
              <Text style={styles.userName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    

      {/* Display posts */}
      {filteredPosts.length > 0 ? (
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.postContainer}>
              <View style={styles.postHeader}>
                <View style={styles.userInfo}>
                  <Image
                    source={item.profileImageUrl ? { uri: item.profileImageUrl } : require('../config/assets/avatar-trang-1.png')}
                    style={styles.avatar}
                  />
                  <View>
                    <Pressable onPress={() => goToUserProfile(item.userId)}>
                      <Text style={styles.postUsername}>{item.name}</Text>
                    </Pressable>
                    <View style={styles.rowContainer}>
                      <Text style={styles.postDate}>{formatDate(item.createdAt)}</Text>
                      <Text style={styles.postCategory}>{item.category}</Text>
                    </View>
                  </View>
                </View>

                {item.userId === user.userId && (
                  <TouchableOpacity onPress={() => deletePost(item.id)}>
                    <Icon name="trash" size={20} color="#f00" />
                  </TouchableOpacity>
                )}
              </View>

              <TruncatedText text={item.description} style={styles.postDescription} />
              <Text style={styles.postDescription}>Vị trí: {item.location}</Text>

              {/* Media Display */}
              {item.mediaUrls && item.mediaTypes && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaContainer}>
                  {item.mediaUrls.map((mediaUrl, index) => (
                    // <View key={index} style={styles.mediaWrapper}>
                    <View key={`${mediaUrl}-${index}`} style={styles.mediaWrapper}>
                      {item.mediaTypes[index] === 'video' ? (
                        <TouchableOpacity onPress={() => openMediaViewer(mediaUrl, 'video')}>
                          <Video
                            source={{ uri: mediaUrl }}
                            style={styles.video}
                            controls={false}
                            resizeMode="cover"
                          />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity onPress={() => openMediaViewer(mediaUrl, 'image')}>
                          <Image source={{ uri: mediaUrl }} style={styles.postMedia} />
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </ScrollView>
              )}

              {/* Action Buttons */}
              <View style={styles.actionContainer}>
                <TouchableOpacity onPress={() => onLikePost(item.id)}>
                  <Icon name={item.likes.includes(user.userId) ? 'heart' : 'heart-o'} size={25} color={item.likes.includes(user.userId) ? 'red' : '#333'} />
                </TouchableOpacity>
                <Text style={styles.likeCount}>{item.likes.length} Likes</Text>

                <TouchableOpacity onPress={() => goToComments(item.id)} style={styles.commentButton}>
                  <Icon name="comment-o" size={25} color="#333" />
                  <Text style={styles.commentCount}> Comments</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleSharePost(item.id, item.description)} style={styles.shareButton}>
                  <Icon name="share" size={20} color="green" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => onSavePost(item.id)} style={styles.saveButton}>
                  <Icon name={savedPosts.includes(item.id) ? 'bookmark' : 'bookmark-o'} size={25} color={savedPosts.includes(item.id) ? 'pink' : '#333'} />
                </TouchableOpacity>
              </View>
            </View>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : noResults ? (
        <Text style={styles.noResults}>Không có bài viết nào phù hợp</Text>
      ) : null}
    </View>
  );
};

export default SearchScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Image, Pressable, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { searchPosts, searchUsers, handleLike, fetchUser } from '../services/Search/searchService';
import { styles } from '../layput/LayoutHome/layoutSearch';

const SearchScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      const userData = await fetchUser();
      if (userData) {
        setUser(userData);
      }
    };
    getUserData();
  }, []);

  // Handle search text change
  useEffect(() => {
    if (searchText.startsWith('@')) {
      searchForUsers(searchText.slice(1));
    } else {
      searchForPosts(searchText);
    }
  }, [searchText]);

  const searchForPosts = async (keyword) => {
    const posts = await searchPosts(keyword);
    setFilteredPosts(posts);
    setNoResults(posts.length === 0);
  };

  const searchForUsers = async (keyword) => {
    const users = await searchUsers(keyword);
    setFilteredUsers(users);
    setNoResults(users.length === 0);
  };

  const goToUserProfile = (userId) => {
    navigation.navigate('UserProfile', { userId });
  };

  const goToComments = (postId) => {
    navigation.navigate('Comments', { postId });
  };

  const likePost = async (postId) => {
    const updatedLikes = await handleLike(postId, user.userId);
    const updatedPosts = filteredPosts.map((post) =>
      post.id === postId ? { ...post, likes: updatedLikes } : post
    );
    setFilteredPosts(updatedPosts);
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

      {filteredUsers.length > 0 ? (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.userContainer}>
              <Pressable onPress={() => goToUserProfile(item.id)}>
                <View style={styles.userInfo}>
                  <Image 
                  //source={{ uri: item.profileImageUrl || 'https://via.placeholder.com/50' }} 
                  source={item.profileImageUrl ? { uri: item.profileImageUrl } : require('../config/assets/avatar-trang-1.png')}
                  style={styles.avatar} />
                  <Text style={styles.username}>{item.name}</Text>
                </View>
              </Pressable>
            </View>
          )}
        />
      ) : filteredPosts.length > 0 ? (
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.postContainer}>
              <View style={styles.postHeader}>
                <View style={styles.userInfo}>
                  <Image 
                  //source={{ uri: item.profileImageUrl || 'https://via.placeholder.com/50' }} 
                  source={item.profileImageUrl ? { uri: item.profileImageUrl } : require('../config/assets/avatar-trang-1.png')}
                  style={styles.avatar} />
                  <Pressable onPress={() => goToUserProfile(item.userId)}>
                    <Text style={styles.postUsername}>{item.name}</Text>
                  </Pressable>
                </View>
              </View>
              <Text style={styles.postDescription}>{item.description}</Text>
              <Text style={styles.postLocation}>Vị trí: {item.location}</Text>
              {item.mediaUrls && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaContainer}>
                  {item.mediaUrls.map((mediaUrl, index) => (
                    <TouchableOpacity key={index} onPress={() => goToComments(item.id)}>
                      <Image source={{ uri: mediaUrl }} style={styles.postMedia} />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
              <View style={styles.actionContainer}>
                <TouchableOpacity onPress={() => likePost(item.id)}>
                  <Icon name={item.likes.includes(user.userId) ? 'heart' : 'heart-o'} size={25} color={item.likes.includes(user.userId) ? 'red' : '#333'} />
                </TouchableOpacity>
                <Text style={styles.likeCount}>{item.likes.length} Likes</Text>
                <TouchableOpacity onPress={() => goToComments(item.id)} style={styles.commentButton}>
                  <Icon name="comment-o" size={25} color="#333" />
                  <Text style={styles.commentCount}> Comments</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      ) : noResults ? (
        <Text style={styles.noResults}>Không có bài viết hoặc người dùng nào phù hợp</Text>
      ) : null}
    </View>
  );
};

export default SearchScreen;

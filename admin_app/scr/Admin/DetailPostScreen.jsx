import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Alert, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { firestore } from '../../firebase/firebase';
import Icon from 'react-native-vector-icons/FontAwesome';

const DetailPostScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchUserName, setSearchUserName] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchContent, setSearchContent] = useState('');

  useEffect(() => {
    // Fetch all posts and user info
    const fetchPosts = async () => {
      const postSnapshot = await firestore().collection('posts').get();
      const postsList = await Promise.all(
        postSnapshot.docs.map(async (doc) => {
          const postData = doc.data();
          // Fetch user data (like profile picture) associated with the post
          const userSnapshot = await firestore().collection('users').doc(postData.userId).get();
          const userData = userSnapshot.data();

          return {
            id: doc.id,
            ...postData,
            user: userData, // Add user data to the post
          };
        })
      );
      setPosts(postsList);
      setFilteredPosts(postsList); // Initially, all posts are shown
    };

    fetchPosts();
  }, []);

  // Handle Deleting a Post
  const handleDeletePost = async (postId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this post?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            await firestore().collection('posts').doc(postId).delete();
            setPosts(posts.filter(post => post.id !== postId));
            setFilteredPosts(filteredPosts.filter(post => post.id !== postId)); // Update filtered list
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  // Handle filter logic
  const filterPosts = () => {
    let filtered = posts;

    // Filter by username
    if (searchUserName) {
      filtered = filtered.filter(post =>
        post.user?.name?.toLowerCase().includes(searchUserName.toLowerCase())
      );
    }

    // Filter by location
    if (searchLocation) {
      filtered = filtered.filter(post =>
        post.location?.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }

    // Filter by post content
    if (searchContent) {
      filtered = filtered.filter(post =>
        post.description?.toLowerCase().includes(searchContent.toLowerCase())
      );
    }

    setFilteredPosts(filtered);
  };

  // Handle filter change
  useEffect(() => {
    filterPosts(); // Reapply filter when any of the search fields change
  }, [searchUserName, searchLocation, searchContent]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin - Bài viết</Text>

      {/* Filters */}
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.filterInput}
          placeholder="Lọc theo tên người dùng"
          value={searchUserName}
          onChangeText={setSearchUserName}
        />
        <TextInput
          style={styles.filterInput}
          placeholder="Lọc theo vị trí"
          value={searchLocation}
          onChangeText={setSearchLocation}
        />
        <TextInput
          style={styles.filterInput}
          placeholder="Lọc theo nội dung bài viết"
          value={searchContent}
          onChangeText={setSearchContent}
        />
      </View>

      {/* Post List */}
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            {/* User info */}
            <View style={styles.userContainer}>
              <Image
                source={{ uri: item.user?.profileImageUrl }}
                
                style={styles.avatar}
              />
              <Text style={styles.userName}>{item.user?.name || 'Unnamed User'}</Text>
            </View>
            <Text style={styles.postDescription}>{item.description}</Text>
            <Text style={styles.postDescription}>Vị trí: {item.location}</Text>
            {/* Post content */}
            {item.mediaUrls ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaContainer}>
                {item.mediaUrls.map((mediaUrl, index) => (
                  <TouchableOpacity key={index} onPress={() => goToComments(item.id)}>
                    <Image source={{ uri: mediaUrl }} style={styles.postMedia} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : null}

            <Icon
              name="trash"
              size={24}
              color="red"
              onPress={() => handleDeletePost(item.id)}
              style={styles.deleteIcon}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 5,
    marginBottom: 10,
  },
  postContainer: {
    padding: 10,
    backgroundColor: '#f1f1f1',
    marginBottom: 10,
    borderRadius: 5,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  postDescription: {
    fontSize: 16,
    color: '#333',
  },
  deleteIcon: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  postMedia: {
    width: 160,
    height: 160,
    borderRadius: 12,
    marginRight: 10,
  },
  mediaContainer: {
    marginBottom: 15,
  },
});

export default DetailPostScreen;

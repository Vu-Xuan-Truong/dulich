import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Alert, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { firestore } from '../../firebase/firebase';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from './Layout/homelayout';
import { collection, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore';
import Video from 'react-native-video';

const AdminScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchUserName, setSearchUserName] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchContent, setSearchContent] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postSnapshot = await getDocs(collection(firestore, 'posts'));
        const postsList = await Promise.all(
          postSnapshot.docs.map(async (postDoc) => {
            const postData = postDoc.data();
            const userRef = doc(firestore, 'users', postData.userId);
            const userSnapshot = await getDoc(userRef);
            const userData = userSnapshot.exists() ? userSnapshot.data() : {};
            return {
              id: postDoc.id,
              ...postData,
              user: userData,
            };
          })
        );
        setPosts(postsList);
        setFilteredPosts(postsList);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  // Handle Deleting a Post
  const handleDeletePost = async (postId) => {
    Alert.alert(
      'Xác nhận',
      'Xóa bài viết?',
      [
        {
          text: 'Bỏ qua',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          onPress: async () => {
            // try {
              const postRef = doc(firestore, 'posts', postId);
              await deleteDoc(postRef);
              setPosts(posts.filter(post => post.id !== postId));
              setFilteredPosts(filteredPosts.filter(post => post.id !== postId));
            // } catch (error) {
            //   console.error("Error deleting post:", error);
            //   Alert.alert('Error', 'Could not delete the post. Please try again.');
            // }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  // Handle filter logic
  const filterPosts = useCallback(() => {
    let filtered = posts;

    if (searchUserName) {
      filtered = filtered.filter(post =>
        post.user?.name?.toLowerCase().includes(searchUserName.toLowerCase())
      );
    }

    if (searchLocation) {
      filtered = filtered.filter(post =>
        post.location?.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }

    if (searchContent) {
      filtered = filtered.filter(post =>
        post.description?.toLowerCase().includes(searchContent.toLowerCase())
      );
    }

    setFilteredPosts(filtered);
  }, [posts, searchUserName, searchLocation, searchContent]);

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

  useEffect(() => {
    filterPosts();
  }, [searchUserName, searchLocation, searchContent, filterPosts]);

  const renderItem = ({ item }) => (
    <PostItem
      item={item}
      onDelete={() => handleDeletePost(item.id)}
      formatDate={formatDate}
      navigation={navigation} // Pass navigation as a prop
    />
  );

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
        renderItem={renderItem}
        initialNumToRender={10} // Adjust for performance
        maxToRenderPerBatch={5} // Adjust for performance
        getItemLayout={(data, index) => (
          { length: 100, offset: 100 * index, index } // Adjust based on your item height
        )}
      />
    </View>
  );
};

// Memoized PostItem Component
const PostItem = React.memo(({ item, onDelete, formatDate, navigation }) => {
  return (
    <View style={styles.postContainer}>
      {/* User info */}
      <View style={styles.userContainer}>
        <Image
          source={{ uri: item.user?.profileImageUrl }}

          style={styles.avatar}
        />
        <Text style={styles.userName}>{item.user?.name || 'Unnamed User'}</Text>
        <Text style={styles.postDate}>{formatDate(item.createdAt)}</Text>
        <Text style={styles.postcategory}> {item.category}</Text>
      </View>
      <Text style={styles.postDescription}>{item.description}</Text>
      <Text style={styles.postDescription}>Vị trí: {item.location}</Text>
      {/* <Text style={styles.postDescription}>Danh mục: {item.category}</Text> */}

      {/* Media Display Section */}
      {item.mediaUrls && item.mediaTypes && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaContainer}>
          {item.mediaUrls.map((mediaUrl, index) => (
            <View key={index} style={styles.mediaWrapper}>
              {item.mediaTypes[index] === 'video' ? (
                <Video
                  source={{ uri: mediaUrl }}
                  style={styles.video}
                  controls={true}
                  resizeMode="cover"
                />
              ) : (
                <TouchableOpacity onPress={() => navigation.navigate('Comments')}>
                  <Image source={{ uri: mediaUrl }} style={styles.postMedia} />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>
      )}
      <View style={styles.iconContainer}>
        <Icon
          name="comment"
          size={24}
          // color="blue"
          onPress={() => navigation.navigate('Comments', { postId: item.id })}
          style={styles.commentIcon}
        />
        <Icon
          name="trash"
          size={24}
          color="red"
          onPress={onDelete}
          style={styles.deleteIcon}
        />
      </View>
    </View>
  );
});


export default AdminScreen;

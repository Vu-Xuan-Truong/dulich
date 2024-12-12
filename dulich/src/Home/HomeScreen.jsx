import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, FlatList, Image, Pressable, ScrollView, TouchableOpacity, Alert, RefreshControl, Share } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider } from 'react-native-popup-menu';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';
import Video from 'react-native-video';
import { styles } from '../layput/LayoutHome/layoutHome';
import TruncatedText from '../services/multipurpose/TruncatedText';

const HomeScreen = ({ navigation, userId, postId }) => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [media, setMedia] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  //FollowingPostsScreen

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = auth().currentUser;
        if (currentUser) {
          setUser(currentUser.uid);
          const userDoc = await firestore().collection('users').doc(currentUser.uid).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            setAvatarUrl(userData.profileImageUrl);
          }
        }
      } catch (error) {
        console.error('Error fetching user: ', error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('posts')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const fetchedPosts = snapshot.docs.map(async doc => {
          const postData = doc.data();
          const userSnapshot = await firestore().collection('users').doc(postData.userId).get();
          const userData = userSnapshot.data();
          const likesSnapshot = await firestore().collection('posts').doc(doc.id).collection('likes').get();
          const likes = likesSnapshot.docs.map(likeDoc => likeDoc.id);

          return {
            id: doc.id,
            name: userData ? userData.name : 'Unknown',
            userId: postData.userId,
            profileImageUrl: userData ? userData.profileImageUrl : null,
            likes,
            createdAt: postData.createdAt,

            ...postData,

          };
        });

        Promise.all(fetchedPosts).then(setPosts);
      });

    return () => unsubscribe();
  }, []);
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .onSnapshot((querySnapshot) => {
        const mediaList = [];
        querySnapshot.forEach((doc) => {
          mediaList.push({ ...doc.data(), id: doc.id });
        });
        setMedia(mediaList);
      });

    return () => unsubscribe();
  }, []);

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

  const goToUserProfile = (userId) => {
    if (userId === user) {
      navigation.navigate('Profile');
    } else {
      navigation.navigate('UserProfile', { userId });
    }
  };

  const goToComments = (postId) => {
    navigation.navigate('Comments', { postId });
  };
  const openMediaViewer = (mediaUrl, mediaType) => {
    navigation.navigate('MediaViewer', { mediaUrl, mediaType });
  };


  const handleLike = async (postId) => {
    const postRef = firestore().collection('posts').doc(postId);
    const likeRef = postRef.collection('likes').doc(user);
    const postIndex = posts.findIndex(post => post.id === postId);

    if (postIndex >= 0) {
      const updatedPosts = [...posts];
      const post = updatedPosts[postIndex];

      if (post.likes.includes(user)) {
        await likeRef.delete();
        post.likes = post.likes.filter(like => like !== user);
      } else {
        await likeRef.set({});
        post.likes.push(user);
      }

      setPosts(updatedPosts);
    }
  };
  const handleSavePost = async (postId) => {
    const savedPostRef = firestore().collection('users').doc(user).collection('savedPosts').doc(postId);

    if (savedPosts.includes(postId)) {
      await savedPostRef.delete();
      setSavedPosts(savedPosts.filter(savedPost => savedPost !== postId));
    } else {
      await savedPostRef.set({});
      setSavedPosts([...savedPosts, postId]);
    }
  };

  useEffect(() => {
    if (user) {
      const savedPostListener = firestore()
        .collection('users')
        .doc(user)
        .collection('savedPosts')
        .onSnapshot(snapshot => {
          const saved = snapshot.docs.map(doc => doc.id);
          setSavedPosts(saved);
        });

      return () => savedPostListener();
    }
  }, [user]);


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

  // Hàm chia sẻ bài viết

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

  // Refresh handler
  const onRefresh = async () => {
    setRefreshing(true); // Start refreshing
    await fetchPosts();  // Fetch the latest posts
    setRefreshing(false); // End refreshing
  };

  const handleReportPost = (postId) => {
    navigation.navigate('Report', { postId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Tạo Menu sổ xuống cho TrailTales */}
        <Menu>
          <MenuTrigger>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.title}>TrailTales</Text>
              <Icon name="angle-down" size={20} style={{ marginLeft: 5 }} />
            </View>
          </MenuTrigger>
          <MenuOptions style={{ position: 'absolute', top: 30, left: 0, right: 0 }}>
            <MenuOption onSelect={() => navigation.navigate('FollowingPosts')}>
              <Text style={styles.optionText}>Đang theo dõi</Text>
            </MenuOption>
          </MenuOptions>
        </Menu>

        <View style={styles.iconsContainer}>
          <Pressable onPress={() => navigation.replace('Search')}>
            <Icon name="search" size={30} style={styles.icon} />
          </Pressable>
          <Pressable onPress={() => navigation.replace('Profile')}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar1} />
            ) : (
              // <Icon name="user" size={30} style={styles.icon} />
              <Image source={require('../config/assets/avatar-trang-1.png')} style={styles.avatar1} />
            )}
          </Pressable>
        </View>
      </View>

      <Text style={styles.title2}>Bài Viết Mới</Text>
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <View style={styles.postHeader}>
              <View style={styles.userInfo}>
                <Image
                  //source={{ uri: item.profileImageUrl || 'https://via.placeholder.com/50' }}
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

              {/* {item.userId === user && (
                <TouchableOpacity onPress={() => deletePost(item.id)}>
                  <Icon name="trash" size={20} color="#f00" />
                </TouchableOpacity>
              )}  */}
              <Menu>
                <MenuTrigger>
                  <Icon name="ellipsis-v" size={20} color="#333" />
                </MenuTrigger>
                <MenuOptions>
                  <MenuOption onSelect={() => handleReportPost(item.id)}>
                    <Text style={styles.menuOptionText}>⚠️ Tố cáo</Text>
                  </MenuOption>
                  {item.userId === user && (
                    <MenuOption onSelect={() => deletePost(item.id)}>
                      <Text style={[styles.menuOptionText, { color: 'red' }]}>❌ Xóa</Text>
                    </MenuOption>
                  )}
                </MenuOptions>
              </Menu>


            </View>

            {/* <Text style={styles.postDescription}>{item.description}</Text> */}
            <TruncatedText text={item.description} style={styles.postDescription} />
            <Text style={styles.postDescription}>Vị trí: {item.location}</Text>
            {/* <Text style={styles.postDescription}>Danh mục: {item.category}</Text> */}

            {/* Media Display Section */}
            {item.mediaUrls && item.mediaTypes && (

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaContainer}>
                {item.mediaUrls.map((mediaUrl, index) => (
                  <View key={index} style={styles.mediaWrapper}>
                    {item.mediaTypes[index] === 'video' ? (
                      <TouchableOpacity onPress={() => openMediaViewer(mediaUrl, 'video')}>
                        <Video
                          source={{ uri: mediaUrl }}
                          style={styles.video}
                          controls={false} // Disable controls in list view
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

            <View style={styles.actionContainer}>
              <TouchableOpacity onPress={() => handleLike(item.id)}>
                <Icon name={item.likes.includes(user) ? 'heart' : 'heart-o'} size={25} color={item.likes.includes(user) ? 'red' : '#333'} />
              </TouchableOpacity>
              <Text style={styles.likeCount}>{item.likes.length} Likes</Text>

              <TouchableOpacity onPress={() => goToComments(item.id)} style={styles.commentButton}>
                <Icon name="comment-o" size={25} color="#333" />
                <Text style={styles.commentCount}> Comments</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleSharePost(item.id, item.description)} style={styles.shareButton}>
                <Icon name="share" size={20} color="green" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleSavePost(item.id)} style={styles.saveButton}>
                <Icon name={savedPosts.includes(item.id) ? 'bookmark' : 'bookmark-o'} size={25} color={savedPosts.includes(item.id) ? 'pink' : '#333'} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

    </View>
  );
};

export default HomeScreen;

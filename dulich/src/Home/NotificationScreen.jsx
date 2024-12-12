import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, RefreshControl } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Video from 'react-native-video';
import { fetchNotifications, fetchFollowers, handleFollow, handleUnfollow } from '../services/Home/notificationService';
import { styles } from '../layput/LayoutHome/layouNotification';

const NotificationScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [likes, setLikes] = useState([]); // State for likes
  const [activeTab, setActiveTab] = useState('comments');
  const [followedUserIds, setFollowedUserIds] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const user = auth().currentUser;

  const loadNotifications = async () => {
    const notifications = await fetchNotifications(user.uid);
    setNotifications(notifications);
  };

  const loadFollowers = async () => {
    const { followers, followedIds } = await fetchFollowers(user.uid);
    setFollowers(followers);
    setFollowedUserIds(followedIds);
  };

  const loadLikes = async () => {
    try {
      const postsSnapshot = await firestore()
        .collection('posts')
        .where('userId', '==', user.uid) // Only load likes for the current user's posts
        .get();
  
      let likesData = [];
      for (const post of postsSnapshot.docs) {
        const likesSnapshot = await post.ref.collection('likes').get();
        likesSnapshot.forEach((likeDoc) => {
          if (likeDoc.id !== user.uid) { // Exclude likes from the current user
            likesData.push({
              postId: post.id,
              userId: likeDoc.id,
            });
          }
        });
      }
  
      const likesWithDetails = await Promise.all(
        likesData.map(async (like) => {
          // Fetch user details
          const userDoc = await firestore().collection('users').doc(like.userId).get();
          const userName = userDoc.data()?.name || 'Unknown';
          const userProfileImageUrl = userDoc.data()?.profileImageUrl || null;
  
          // Fetch post details
          const postDoc = await firestore().collection('posts').doc(like.postId).get();
          let firstMediaUrl = null;
          let firstMediaType = null;
  
          if (postDoc.exists) {
            const postData = postDoc.data();
            if (postData.mediaUrls && postData.mediaUrls.length > 0) {
              firstMediaUrl = postData.mediaUrls[0];
              firstMediaType =
                postData.mediaTypes && postData.mediaTypes.length > 0
                  ? postData.mediaTypes[0]
                  : null;
            }
          }
  
          return {
            postId: like.postId,
            userId: like.userId,
            name: userName,
            profileImageUrl: userProfileImageUrl,
            firstMediaUrl,
            firstMediaType,
          };
        })
      );
  
      setLikes(likesWithDetails);
    } catch (error) {
      console.error('Error loading likes:', error);
    }
  };
  
  

  useEffect(() => {
    loadNotifications();
    loadFollowers();
    loadLikes();
  }, [user.uid]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      if (activeTab === 'comments') {
        await loadNotifications();
      } else if (activeTab === 'followers') {
        await loadFollowers();
      } else if (activeTab === 'likes') {
        await loadLikes();
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderLike = ({ item }) => {
    return (
      <View style={styles.notificationContainer}>
        <Text style={styles.newlike}>Thông báo:</Text>
        <TouchableOpacity
          style={styles.notificationContent}
          onPress={() => navigation.navigate('Comments', { postId: item.postId })}
        >
          {item.firstMediaUrl && item.firstMediaType && (
            <View style={styles.mediaWrapper}>
              {item.firstMediaType === 'video' ? (
                <Video
                  source={{ uri: item.firstMediaUrl }}
                  style={styles.video}
                  controls={true}
                  resizeMode="cover"
                />
              ) : (
                <Image source={{ uri: item.firstMediaUrl }} style={styles.postMedia} />
              )}
            </View>
          )}
          <View style={styles.likeInfo}>
            <Image
              source={
                item.profileImageUrl
                  ? { uri: item.profileImageUrl }
                  : require('../config/assets/avatar-trang-1.png')
              }
              style={styles.avatar}
            />
            <View>
              <Text style={styles.commenterName}>{item.name}</Text>
              <Text style={styles.likeContent}>đã thích bài viết của bạn</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  
  

  // Render a single notification
  const renderNotification = ({ item }) => {
    if (item.type === 'comment') {
      return (
        <View style={styles.notificationContainer}>
          <Text style={styles.newcomment}>Thông báo bình luận ở bài viết:</Text>
          <TouchableOpacity
            style={styles.notificationContent}
            onPress={() => navigation.navigate('Comments', { postId: item.postId })}
          >
            {item.firstMediaUrl && item.firstMediaType && (
              <View style={styles.mediaWrapper}>
                {item.firstMediaType === 'video' ? (
                  <Video
                    source={{ uri: item.firstMediaUrl }}
                    style={styles.video}
                    controls={true}
                    resizeMode="cover"
                  />
                ) : (
                  <Image source={{ uri: item.firstMediaUrl }} style={styles.postMedia} />
                )}
              </View>
            )}
            <View style={styles.commentInfo}>
              <Image
                source={item.commenterAvatar ? { uri: item.commenterAvatar } : require('../config/assets/avatar-trang-1.png')}
                style={styles.avatar}
              />
              <View>
                <Text style={styles.commenterName}>{item.commenterName}</Text>
                <Text style={styles.commentContent}>{item.content}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  const renderFollower = ({ item }) => {
    const isFollowed = followedUserIds.includes(item.id);

    const onFollow = async (followerId) => {
      await handleFollow(user.uid, followerId);
      setFollowedUserIds((prev) => [...prev, followerId]); // Update state to reflect follow
    };

    const onUnfollow = async (followerId) => {
      await handleUnfollow(user.uid, followerId);
      setFollowedUserIds((prev) => prev.filter((id) => id !== followerId)); // Update state to reflect unfollow
    };

    return (
      <View style={styles.followerContainer}>
        <TouchableOpacity>
          <Image source={{ uri: item.profileImageUrl }} style={styles.followerAvatar} />
        </TouchableOpacity>
        <Text style={styles.followerName}>{item.name || 'Unknown'}</Text>
        <TouchableOpacity
          style={isFollowed ? styles.unfollowButton : styles.followButton}
          onPress={() => (isFollowed ? onUnfollow(item.id) : onFollow(item.id))}
        >
          <Text style={styles.buttonText}>{isFollowed ? 'Unfollow' : 'Follow'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hoạt Động</Text>
      <View style={styles.tabMenu}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'comments' && styles.activeTab]}
          onPress={() => setActiveTab('comments')}
        >
          <Text style={styles.tabText}>Bình luận</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'followers' && styles.activeTab]}
          onPress={() => setActiveTab('followers')}
        >
          <Text style={styles.tabText}>Người theo dõi</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'likes' && styles.activeTab]}
          onPress={() => setActiveTab('likes')}
        >
          <Text style={styles.tabText}>Lượt thích</Text>
        </TouchableOpacity>
      </View>
      <FlatList
  data={
    activeTab === 'comments'
      ? notifications
      : activeTab === 'followers'
      ? followers
      : likes
  }
  // keyExtractor={(item, index) => {
  //   // Use a combination of fields or fallback to the index if no unique ID is available
  //   return item.userId
  //     ? `${item.userId}-${item.postId || index}` // Unique combination for likes
  //     : item.id || String(index); // Use `id` for other items
  // }}
  renderItem={
    activeTab === 'comments'
      ? renderNotification
      : activeTab === 'followers'
      ? renderFollower
      : renderLike
  }
  contentContainerStyle={styles.listContainer}
  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
  showsVerticalScrollIndicator={false}
/>
    </View>
  );
};

export default NotificationScreen;

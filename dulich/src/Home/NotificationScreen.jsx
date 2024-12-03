import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, RefreshControl } from 'react-native';
import auth from '@react-native-firebase/auth';
import Video from 'react-native-video';
import { fetchNotifications, fetchFollowers, handleFollow, handleUnfollow } from '../services/Home/notificationService';
import { styles } from '../layput/LayoutHome/layouNotification';

const NotificationScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [activeTab, setActiveTab] = useState('comments');
  const [followedUserIds, setFollowedUserIds] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // State to handle refreshing
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

  // Load data on component mount
  useEffect(() => {
    loadNotifications();
    loadFollowers();
  }, [user.uid]);

  // Refresh function
  const handleRefresh = async () => {
    setRefreshing(true); // Show spinner
    try {
      if (activeTab === 'comments') {
        await loadNotifications();
      } else {
        await loadFollowers();
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false); // Hide spinner
    }
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
      </View>
      <FlatList
        data={activeTab === 'comments' ? notifications : followers}
        keyExtractor={(item) => item.id}
        renderItem={activeTab === 'comments' ? renderNotification : renderFollower}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default NotificationScreen;

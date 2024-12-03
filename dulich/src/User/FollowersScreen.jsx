import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from '../layput/LayoutUser/layoutFollower';
const FollowersScreen = ({ navigation }) => {
  const [followers, setFollowers] = useState([]);
  const [followingStatus, setFollowingStatus] = useState({});
  const user = auth().currentUser;

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const followersSnapshot = await firestore()
          .collection('users')
          .doc(user.uid)
          .collection('followers')
          .get();

        const followersDataPromises = followersSnapshot.docs.map(async (doc) => {
          const followerUserId = doc.id;
          const userSnapshot = await firestore().collection('users').doc(followerUserId).get();
          const followerData = userSnapshot.data();

          // Check if the current user is following this follower
          const followingSnapshot = await firestore()
            .collection('users')
            .doc(user.uid)
            .collection('following')
            .doc(followerUserId)
            .get();
          
          const isFollowing = followingSnapshot.exists;

          return {
            id: followerUserId,
            ...followerData,
            isFollowing, // Mark as true or false
          };
        });

        const followersData = await Promise.all(followersDataPromises);
        setFollowers(followersData);

        // Set initial following status
        const status = {};
        followersData.forEach(follower => {
          status[follower.id] = follower.isFollowing;
        });
        setFollowingStatus(status);
      } catch (error) {
        console.error('Error fetching followers: ', error);
      }
    };

    fetchFollowers();
  }, []);

  const handleFollowUnfollow = async (followerId, isFollowing) => {
    try {
      if (isFollowing) {
        // Unfollow
        await firestore().collection('users').doc(user.uid).collection('following').doc(followerId).delete();
        await firestore().collection('users').doc(followerId).collection('followers').doc(user.uid).delete();
        setFollowingStatus(prev => ({ ...prev, [followerId]: false }));
      } else {
        // Follow
        await firestore().collection('users').doc(user.uid).collection('following').doc(followerId).set({});
        await firestore().collection('users').doc(followerId).collection('followers').doc(user.uid).set({});
        setFollowingStatus(prev => ({ ...prev, [followerId]: true }));
      }
    } catch (error) {
      console.error('Error following/unfollowing user: ', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { userId: item.id })}>
        <Image 
        //source={{ uri: item.profileImageUrl || '..\assets\avatar-trang-1.png' }} 
        source={item.profileImageUrl ? { uri: item.profileImageUrl } : require('../config/assets/avatar-trang-1.png')}
        style={styles.profileImage} />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.itemText}>{item.name || item.id}</Text>
        <TouchableOpacity
          style={styles.followButton}
          onPress={() => handleFollowUnfollow(item.id, followingStatus[item.id])}
        >
          <Text style={styles.followButtonText}>
            {followingStatus[item.id] ? 'Unfollow' : 'Follow'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="#000" />
          <Text style={styles.backButtonText}>Trở về</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Danh Sách Người Theo Dõi</Text> 
        <FlatList
          data={followers}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
};



export default FollowersScreen;

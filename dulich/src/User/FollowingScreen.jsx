import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';

const FollowingScreen = ({ navigation }) => {
  const [following, setFollowing] = useState([]);
  const [followingStatus, setFollowingStatus] = useState({});
  const user = auth().currentUser;

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const followingSnapshot = await firestore()
          .collection('users')
          .doc(user.uid)
          .collection('following')
          .get();

        const followingDataPromises = followingSnapshot.docs.map(async (doc) => {
          const followingUserId = doc.id;
          const userSnapshot = await firestore().collection('users').doc(followingUserId).get();
          return {
            id: followingUserId,
            ...userSnapshot.data(),
          };
        });

        const followingData = await Promise.all(followingDataPromises);
        setFollowing(followingData);

        // Initialize following status
        const status = {};
        followingData.forEach(user => {
          status[user.id] = true; // Mark all as followed
        });
        setFollowingStatus(status);
      } catch (error) {
        console.error('Error fetching following users: ', error);
      }
    };

    fetchFollowing();
  }, []);

  const handleFollowUnfollow = async (userId, isFollowing) => {
    try {
      if (isFollowing) {
        // Unfollow
        await firestore().collection('users').doc(user.uid).collection('following').doc(userId).delete();
        await firestore().collection('users').doc(userId).collection('followers').doc(user.uid).delete();
        setFollowingStatus(prev => ({ ...prev, [userId]: false }));
      } else {
        // Follow
        await firestore().collection('users').doc(user.uid).collection('following').doc(userId).set({});
        await firestore().collection('users').doc(userId).collection('followers').doc(user.uid).set({});
        setFollowingStatus(prev => ({ ...prev, [userId]: true }));
      }
    } catch (error) {
      console.error('Error following/unfollowing user: ', error);
    }
  };

  const renderItem = ({ item }) => (
    
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { userId: item.id })}>
        <Image
        //  source={{ uri: item.profileImageUrl || 'https://via.placeholder.com/50' }} 
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
        <Text style={styles.title}>Danh Sách Đang Theo Dõi</Text>  
      <FlatList
        data={following}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 25,
    left:40,
    fontWeight: 'bold',
    },
  
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  itemText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  followButton: {
    backgroundColor: '#007BFF',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  followButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  backButton: {
    flexDirection: 'row',
    fontSize: 20,
    height:40,
    alignItems: 'center',
  },
  backButtonText: {
    marginLeft: 5,
    fontSize: 20,
    color: '#000',
  },
});

export default FollowingScreen;

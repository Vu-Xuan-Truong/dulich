import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from '../layput/LayoutUser/layoutUserProfile';
import Video from 'react-native-video';
const UserProfileScreen = ({ route, navigation }) => {
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [activeTab, setActiveTab] = useState('posts'); // Added state for tab menu

  const user = auth().currentUser;
  const { userId } = route.params;

  useEffect(() => {
    const unsubscribeUser = firestore()
      .collection('users')
      .doc(userId)
      .onSnapshot(
        userSnapshot => {
          setUserData(userSnapshot.data());
          setLoading(false);
        },
        error => {
          console.error('Error fetching user data: ', error);
          setLoading(false);
        }
      );

    const unsubscribeFollowing = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('following')
      .doc(userId)
      .onSnapshot(doc => {
        setIsFollowing(doc.exists);
      });

    const unsubscribeFollowersCount = firestore()
      .collection('users')
      .doc(userId)
      .collection('followers')
      .onSnapshot(snapshot => {
        setFollowersCount(snapshot.size);
      });

    const unsubscribeFollowingCount = firestore()
      .collection('users')
      .doc(userId)
      .collection('following')
      .onSnapshot(snapshot => {
        setFollowingCount(snapshot.size);
      });

    const unsubscribePosts = firestore()
      .collection('posts')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        postsSnapshot => {
          const fetchedPosts = postsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUserPosts(fetchedPosts);
          setLoading(false);
        },
        error => {
          console.error('Error fetching posts: ', error);
          setLoading(false);
        }
      );

    return () => {
      unsubscribeUser();
      unsubscribeFollowing();
      unsubscribeFollowersCount();
      unsubscribeFollowingCount();
      unsubscribePosts();
    };
  }, [userId]);

  const handleFollow = async () => {
    if (user && userData) {
      if (isFollowing) {
        await firestore()
          .collection('users')
          .doc(user.uid)
          .collection('following')
          .doc(userId)
          .delete();

        await firestore()
          .collection('users')
          .doc(userId)
          .collection('followers')
          .doc(user.uid)
          .delete();
      } else {
        await firestore()
          .collection('users')
          .doc(user.uid)
          .collection('following')
          .doc(userId)
          .set({});

        await firestore()
          .collection('users')
          .doc(userId)
          .collection('followers')
          .doc(user.uid)
          .set({});
      }
    }
  };

  const handleImagePress = (postId) => {
    navigation.navigate('Comments', { postId });
  };

  const navigateToChat = () => {
    const chatId = user.uid > userId ? `${user.uid}_${userId}` : `${userId}_${user.uid}`;
    navigation.navigate('ChatScreen', { chatId, userId, userName: userData.name });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  // const renderPostItem = ({ item }) => {
  //   const firstImage = item.mediaUrls && item.mediaUrls.length > 0 ? item.mediaUrls[0] : null;

  //   return (
  //     <TouchableOpacity onPress={() => handleImagePress(item.id)}>
  //       {firstImage ? (
  //         <Image source={{ uri: firstImage }} style={styles.postImage} />
  //       ) : (
  //         <View style={styles.noImagePost}>
  //           <Text style={styles.noImageText}>Không có hình ảnh</Text>
  //         </View>
  //       )}
  //     </TouchableOpacity>
  //   );
  // };
  const renderPostItem = ({ item }) => {
    // Lấy media đầu tiên
    const firstMediaUrl = item.mediaUrls && item.mediaUrls.length > 0 ? item.mediaUrls[0] : null;
    const firstMediaType = item.mediaTypes && item.mediaTypes.length > 0 ? item.mediaTypes[0] : null;

    return (
      <TouchableOpacity onPress={() => navigation.navigate('Comments', { postId: item.id })}>
        {/* Hiển thị media đầu tiên */}
        {firstMediaUrl && firstMediaType && (
          <View style={styles.mediaWrapper}>
            {firstMediaType === 'video' ? (
              <Video
                source={{ uri: firstMediaUrl }}
                style={styles.video}
                controls={true}
                resizeMode="cover"
              />
            ) : (
              <Image source={{ uri: firstMediaUrl }} style={styles.postMedia} />
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };


  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
        <Icon name="arrow-left" size={20} color="#000" />
        <Text style={styles.backButtonText}>Trở về</Text>
      </TouchableOpacity>
      {userData && (
        <>
          <View style={styles.userInfoContainer}>
            <Image source={{ uri: userData.profileImageUrl }} style={styles.profileImage} />
            <Text style={styles.name}>{userData.name}</Text>
            <Text style={styles.userBio}>{userData.bio}</Text>

            <View style={styles.statsContainer}>
              <TouchableOpacity style={styles.stat} onPress={() => navigation.navigate('Following')}>
                <Text style={styles.statNumber}>{followingCount}</Text>
                <Text style={styles.statLabel}>Đã Follow</Text>
              </TouchableOpacity>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{userPosts.length}</Text>
                <Text style={styles.statLabel}>Bài viết</Text>
              </View>
              <TouchableOpacity style={styles.stat} onPress={() => navigation.navigate('Follower')}>
                <Text style={styles.statNumber}>{followersCount}</Text>
                <Text style={styles.statLabel}>Follower</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={isFollowing ? styles.unfollowButton : styles.followButton}
                onPress={handleFollow}
              >
                <Text style={styles.followButtonText}>{isFollowing ? 'Bỏ theo dõi' : 'Theo dõi'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.editProfileButton} onPress={navigateToChat}>
                <Icon name="send" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Tab Menu */}
          <View style={styles.tabMenu}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'posts' && styles.activeTab]}
              onPress={() => setActiveTab('posts')}
            >
              <Icon
                name="list-alt" // Icon for posts tab
                size={24}
                color={activeTab === 'posts' ? '#000' : '#666'}
              />
            </TouchableOpacity>
           
          </View>

          <FlatList
            data={userPosts}
            keyExtractor={(item) => item.id}
            numColumns={3}
            columnWrapperStyle={styles.columnWrapper}
            renderItem={renderPostItem}
          />
        </>
      )}
    </View>
  );
};


export default UserProfileScreen;

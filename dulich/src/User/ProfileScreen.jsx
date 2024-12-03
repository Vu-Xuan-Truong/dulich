import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from '../layput/LayoutUser/layoutProfile';
import Video from 'react-native-video';
const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]); // State for saved posts
  const [loading, setLoading] = useState(true);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [showMenu, setShowMenu] = useState(false); // State for menu visibility
  const [activeTab, setActiveTab] = useState('posts'); // State to track active tab (posts or saved)
  const user = auth().currentUser;

  useEffect(() => {
    if (user) {
      const userId = user.uid;

      // Fetch user data
      const unsubscribeUser = firestore().collection('users').doc(userId).onSnapshot(
        (userSnapshot) => {
          setUserData(userSnapshot.data());
          setLoading(false);
        },
      );

      // Fetch following and followers count
      const unsubscribeFollowing = firestore()
        .collection('users')
        .doc(userId)
        .collection('following')
        .onSnapshot((snapshot) => {
          setFollowingCount(snapshot.size);
        });

      const unsubscribeFollowers = firestore()
        .collection('users')
        .doc(userId)
        .collection('followers')
        .onSnapshot((snapshot) => {
          setFollowersCount(snapshot.size);
        });

      // Fetch user posts
      const unsubscribePosts = firestore()
        .collection('posts')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .onSnapshot((postsSnapshot) => {
          const fetchedPosts = postsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUserPosts(fetchedPosts);
          setLoading(false);
        });

      // Fetch saved posts
      const unsubscribeSavedPosts = firestore()
        .collection('users')
        .doc(userId)
        .collection('savedPosts')
        .onSnapshot((savedSnapshot) => {
          const fetchedSavedPosts = savedSnapshot.docs.map(async (doc) => {
            const postDoc = await firestore().collection('posts').doc(doc.id).get();
            return {
              id: postDoc.id,
              ...postDoc.data(),
            };
          });
          Promise.all(fetchedSavedPosts).then(setSavedPosts);
        });

      return () => {
        unsubscribeUser();
        unsubscribeFollowing();
        unsubscribeFollowers();
        unsubscribePosts();
        unsubscribeSavedPosts();
      };
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn muốn thoát phải không',
      [
        {
          text: 'Bỏ qua',
          style: 'cancel',
        },
        {
          text: 'Thoát',
          onPress: async () => {
            await auth().signOut();
            navigation.navigate('Login'); // Navigate to Login screen after logging out
          },
          style: 'destructive',
        },
      ],
      { cancelable: true },
    );
  };
  const adjustedSavedPosts = savedPosts.length % 3 === 0
    ? savedPosts
    : [...savedPosts, ...Array(3 - (savedPosts.length % 3)).fill({ id: 'placeholder' })];

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


  const renderSavedPostItem = ({ item }) => {
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
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {userData && (
            <>
              <View style={styles.userInfoContainer}>
                {/* Menu Button */}
                <TouchableOpacity style={styles.menuButton} onPress={() => setShowMenu(!showMenu)}>
                  <Icon name="ellipsis-v" size={24} color="#000" />
                </TouchableOpacity>
                {/* Menu Options */}
                {showMenu && (
                  <View style={styles.menu}>
                    <TouchableOpacity style={styles.menuItem}>
                      <Text style={styles.menuItemText} onPress={() => navigation.navigate('PasswordReset')}>
                        Đổi mật khẩu
                      </Text>
                      <Text style={styles.menuItemText} onPress={() => navigation.navigate('Contact')}>
                        Liên hệ
                      </Text>
                      <Text style={styles.menuItemText} onPress={handleLogout}>
                        Đăng xuất
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                <TouchableOpacity>
                  <Image 
                  // source={{ uri: userData.profileImageUrl }} 
                  source={userData.profileImageUrl ? { uri: userData.profileImageUrl } : require('../config/assets/avatar-trang-1.png')}
                  style={styles.profileImage} />
                </TouchableOpacity>
                <Text style={styles.name}>{userData.name}</Text>
                <Text style={styles.userBio}>{userData.bio}</Text>

                <View style={styles.statsContainer}>
                  <TouchableOpacity style={styles.stat} onPress={() => navigation.navigate('Following')}>
                    <Text style={styles.statNumber}>{followingCount}</Text>
                    <Text style={styles.statLabel}>Đã Follow</Text>
                  </TouchableOpacity>
                  <View style={styles.stat}>
                    <Text style={styles.statNumber}>{userPosts.length}</Text>
                    <Text style={styles.statLabel}>Bài Viết</Text>
                  </View>
                  <TouchableOpacity style={styles.stat} onPress={() => navigation.navigate('Follower')}>
                    <Text style={styles.statNumber}>{followersCount}</Text>
                    <Text style={styles.statLabel}>Follower</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.editProfileButton} onPress={() => navigation.navigate('EditUser')}>
                  <Text style={styles.editProfileButtonText}>Cập nhật thông tin cá nhân</Text>
                </TouchableOpacity>
              </View>

              {/* Tab Menu */}
              <View style={styles.tabMenu}>
                <TouchableOpacity
                  style={[styles.tabButton, activeTab === 'posts' && styles.activeTab]}
                  onPress={() => setActiveTab('posts')}
                >
                  <Icon
                    name="list-alt" // Icon for posts (can be replaced with any icon)
                    size={24}
                    color={activeTab === 'posts' ? '#000' : '#666'} // Change color based on active tab
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tabButton, activeTab === 'saved' && styles.activeTab]}
                  onPress={() => setActiveTab('saved')}
                >
                  <Icon
                    name="bookmark" // Icon for saved posts
                    size={24}
                    color={activeTab === 'saved' ? '#000' : '#666'} // Change color based on active tab
                  />
                </TouchableOpacity>
              </View>

              {/* Conditional Rendering based on Active Tab */}
              {/* {activeTab === 'posts' ? (
                <FlatList data={userPosts} keyExtractor={(item) => item.id} numColumns={3} renderItem={renderPostItem} />
              ) : (
                <FlatList data={savedPosts} keyExtractor={(item) => item.id} numColumns={3} renderItem={renderSavedPostItem} />
              )} */}
              {activeTab === 'posts' ? (
                <FlatList
                  data={userPosts}
                  keyExtractor={(item) => item.id}
                  numColumns={3}
                  renderItem={renderPostItem}
                  columnWrapperStyle={styles.columnWrapper}
                  ItemSeparatorComponent={() => <View style={styles.rowSeparator} />}
                />
              ) : (
                <FlatList
                  data={adjustedSavedPosts}
                  keyExtractor={(item) => item.id}
                  numColumns={3}
                  renderItem={({ item }) =>
                    item.id === 'placeholder' ? <View style={styles.placeholderItem} /> : renderPostItem({ item })
                  }
                  columnWrapperStyle={styles.columnWrapper}
                  ItemSeparatorComponent={() => <View style={styles.rowSeparator} />}
                />
              )}

            </>
          )}
        </>
      )}
    </View>
  );
};

export default ProfileScreen;

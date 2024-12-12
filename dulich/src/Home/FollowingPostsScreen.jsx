import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Alert, RefreshControl, Pressable, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Video from 'react-native-video';
import { styles } from '../layput/LayoutHome/layoutHome';
import {
    fetchCurrentUser,
    fetchFollowingList,
    fetchPostsByFollowing,
    deletePostById,
    toggleLikePost,
    toggleSavePost,
} from '../services/Home/FollowPostsService';
import TruncatedText from '../services/multipurpose/TruncatedText';

const FollowingPostsScreen = ({ navigation }) => {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [savedPosts, setSavedPosts] = useState([]);  // Add savedPosts state

    useEffect(() => {
        const fetchData = async () => {
            const currentUser = await fetchCurrentUser();
            if (currentUser) {
                setUser(currentUser);
                const followingList = await fetchFollowingList(currentUser.uid);
                const fetchedPosts = await fetchPostsByFollowing(followingList);
                setPosts(fetchedPosts);
            }
        };
        fetchData();
    }, []);

    const handleLike = async (postId) => {
        const postIndex = posts.findIndex(post => post.id === postId);
        if (postIndex >= 0) {
            const updatedPosts = [...posts];
            const post = updatedPosts[postIndex];
            const isLiked = post.likes.includes(user.uid);

            // Toggle like status
            await toggleLikePost(postId, user.uid, isLiked);

            if (isLiked) {
                post.likes = post.likes.filter(like => like !== user.uid);  // Remove like
            } else {
                post.likes.push(user.uid);  // Add like
            }

            // Update the state
            setPosts(updatedPosts);
        }
    };

    const handleSavePost = async (postId) => {
        const postIndex = posts.findIndex(post => post.id === postId);
        if (postIndex >= 0) {
            const updatedPosts = [...posts];
            const post = updatedPosts[postIndex];
            const isSaved = post.isSaved;

            await toggleSavePost(postId, user.uid, isSaved);

            post.isSaved = !isSaved;

            // Update the savedPosts state
            setSavedPosts((prevSavedPosts) => {
                if (isSaved) {
                    return prevSavedPosts.filter(savedId => savedId !== postId); // Remove postId if it was saved
                } else {
                    return [...prevSavedPosts, postId]; // Add postId to savedPosts if it wasn't saved
                }
            });

            setPosts(updatedPosts);
        }
    };
    const goToComments = (postId) => {
        navigation.navigate('Comments', { postId });
    };
    const goToUserProfile = (userId) => {
        if (userId === user) {
            navigation.navigate('Profile');
        } else {
            navigation.navigate('UserProfile', { userId });
        }
    };
    const openMediaViewer = (mediaUrl, mediaType) => {
        navigation.navigate('MediaViewer', { mediaUrl, mediaType });
    };
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


    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Icon name="chevron-left" size={25} color="#000" />
            </TouchableOpacity>

            <Text style={styles.title2}>Đang theo dõi</Text>
            <FlatList
                data={posts}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.postContainer}>
                        <View style={styles.postHeader}>
                            <View style={styles.userInfo}>
                                <Image
                                    // source={{ uri: item.profileImageUrl || 'https://via.placeholder.com/50' }}
                                    source={item.profileImageUrl ? { uri: item.profileImageUrl } : require('../config/assets/avatar-trang-1.png')}
                                    style={styles.avatar}
                                />
                                <View>
                                    <Pressable onPress={() => goToUserProfile(item.userId)}>
                                        <Text style={styles.postUsername}>{item.name}</Text>
                                    </Pressable>
                                    {/* <Text style={styles.postDate}>{formatDate(item.createdAt)}</Text> */}
                                    <View style={styles.rowContainer}>
                                        <Text style={styles.postDate}>{formatDate(item.createdAt)}</Text>
                                        <Text style={styles.postCategory}>{item.category}</Text>
                                    </View>
                                </View>
                            </View>

                            {item.userId === user && (
                                <TouchableOpacity onPress={() => deletePost(item.id)}>
                                    <Icon name="trash" size={20} color="#f00" />
                                </TouchableOpacity>
                            )}
                        </View>

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
                                                    controls={true}
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
                                <Icon
                                    name={item.likes.includes(user.uid) ? 'heart' : 'heart-o'}
                                    size={25}
                                    color={item.likes.includes(user.uid) ? 'red' : '#333'}
                                />
                            </TouchableOpacity>

                            <Text style={styles.likeCount}>{item.likes.length} Likes</Text>

                            <TouchableOpacity onPress={() => goToComments(item.id)} style={styles.commentButton}>
                                <Icon name="comment-o" size={25} color="#333" />
                                <Text style={styles.commentCount}> Comments</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => handleSavePost(item.id)} style={styles.saveButton}>
                                <Icon name={savedPosts.includes(item.id) ? 'bookmark' : 'bookmark-o'} size={25} color={savedPosts.includes(item.id) ? 'pink' : '#333'} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); /* Refresh logic */ setRefreshing(false); }} />}
            />
        </View>
    );
};

export default FollowingPostsScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { fetchPostComments, addComment, editComment, deleteComment, deletePost } from '../services/Post/commentsBackend';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import Video from 'react-native-video';
import { styles } from '../layput/layoutPots/layoutComment';

const CommentsScreen = ({ route, navigation }) => {
  const { postId } = route.params;
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState('');
  const [savedPosts, setSavedPosts] = useState([]);
  const user = auth().currentUser;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postDoc = await firestore().collection('posts').doc(postId).get();
        if (postDoc.exists) {
          const postData = postDoc.data();
          const userSnapshot = await firestore().collection('users').doc(postData.userId).get();
          const userName = userSnapshot.exists ? userSnapshot.data().name : 'Unknown';
          const userAvatar = userSnapshot.exists ? userSnapshot.data().profileImageUrl : null;
          setPost({ id: postDoc.id, ...postData, userName, userAvatar });
        } else {
          console.warn('Post does not exist');
        }
      } catch (error) {
        console.error('Error fetching post: ', error);
      }
    };

    const unsubscribe = firestore()
      .collection('comments')
      .where('postId', '==', postId)
      .orderBy('createdAt', 'asc')
      .onSnapshot(async (snapshot) => {
        if (snapshot && snapshot.docs) {
          const fetchedComments = await Promise.all(
            snapshot.docs.map(async (doc) => {
              const data = doc.data();
              const userDoc = await firestore().collection('users').doc(data.userId).get();
              const username = userDoc.exists ? userDoc.data().name : 'Unknown';
              const userAvatar = userDoc.exists ? userDoc.data().profileImageUrl : null;
              return { id: doc.id, username, userAvatar, ...data };
            })
          );
          setComments(fetchedComments);
        }
      });

    fetchPost();

    return () => unsubscribe();
  }, [postId]);

  const handleAddComment = async () => {
    if (newComment.trim() === '') {
      alert('Comment cannot be empty');
      return;
    }
    try {
      await addComment(postId, user.uid, newComment);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment: ', error);
    }
  };

  const handleEditComment = async (commentId) => {
    if (editedComment.trim() === '') {
      alert('Comment cannot be empty');
      return;
    }
    try {
      await editComment(commentId, editedComment);
      setEditingCommentId(null);
      setEditedComment('');
    } catch (error) {
      console.error('Error editing comment: ', error);
    }
  };


  const handleDeleteComment = (commentId) => {
    Alert.alert(
      'Confirm Delete',
      'Bạn muốn xóa bình luận này ?',
      [
        { text: 'Bỏ qua', style: 'cancel' },
        {
          text: 'Xóa',
          onPress: async () => {
            try {
              await deleteComment(commentId);
            } catch (error) {
              console.error('Error deleting comment: ', error);
            }
          },
          style: 'destructive'
        }
      ],
      { cancelable: true }
    );
  };
  // Hàm xóa bài viết
  const handleDeletePost = () => {
    Alert.alert(
      'Confirm Delete',
      'Bạn muốn xóa bài viết này ?',
      [
        { text: 'Bỏ qua', style: 'cancel' },
        {
          text: 'Xóa',
          onPress: async () => {
            try {
              await deletePost(postId); // Gọi hàm xóa bài viết từ services
              navigation.goBack(); // Quay lại màn hình trước sau khi xóa thành công
            } catch (error) {
              console.error('Error deleting post: ', error);
            }
          },
          style: 'destructive'
        }
      ],
      { cancelable: true }
    );
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
  const handleLike = async () => {
    if (post) {
      const liked = post.likes.includes(user.uid);
      const postRef = firestore().collection('posts').doc(post.id).collection('likes').doc(user.uid);

      if (liked) {
        await postRef.delete();
        setPost(prevPost => ({
          ...prevPost,
          likes: prevPost.likes.filter(uid => uid !== user.uid),
        }));
      } else {
        await postRef.set({});
        setPost(prevPost => ({
          ...prevPost,
          likes: [...prevPost.likes, user.uid],
        }));
      }
    }
  };

  const handleSavePost = async () => {
    const savedPostRef = firestore().collection('users').doc(user.uid).collection('savedPosts').doc(post.id);
    if (savedPosts.includes(post.id)) {
      await savedPostRef.delete();
      setSavedPosts(savedPosts.filter(savedPost => savedPost !== post.id));
    } else {
      await savedPostRef.set({});
      setSavedPosts([...savedPosts, post.id]);
    }
  };

  return (
    <View style={styles.container}>
      {post && (
        <View style={styles.postContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={20} color="#000" />
            <Text style={styles.backButtonText}>Trở về</Text>
          </TouchableOpacity>
          <View style={styles.postHeader}>
            <View style={styles.userInfo}>
              {post.userAvatar ? (
                <Image source={{ uri: post.userAvatar }} style={styles.avatar} />
              ) : (
                <Image source={require('../config/assets/avatar-trang-1.png')} style={styles.avatar} />
              )}
              <View>
                <Text style={styles.postUsername}>{post.userName || 'Unknown'}</Text>
                <View style={styles.rowContainer}>
                  <Text style={styles.postDate}>{formatDate(post.createdAt)}</Text>
                  <Text style={styles.postcategory}>{post.category}</Text>
                </View>
              </View>
            </View>
            {user && user.uid === post.userId && (
              <View style={styles.postActions}>
                <TouchableOpacity onPress={() => 
                  // navigation.navigate('EditPost', { postId: post.id })
                  navigation.navigate('EditPost', {
                    postId: postId,
                    initialContent: post.description,
                    initialLocation: post.location,
                    initialMediaUris: post.mediaUrls,
                    initialCategory: post.category,
                  })                 
                  }>
                  <Icon name="edit" style={styles.iconedit} size={20} color="blue" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDeletePost}>
                  <Icon name="trash" size={20} color="#f00" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <Text style={styles.postDescription}>{post.description}</Text>
          <Text style={styles.postDescription}>Vị trí: {post.location}</Text>
          {/* <Text style={styles.postDescription}>Danh mục: {post.category}</Text> */}

          {/* Media Display Section */}
          {post.mediaUrls && post.mediaTypes && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaContainer}>
              {post.mediaUrls.map((mediaUrl, index) => (
                <View key={index} style={styles.mediaWrapper}>
                  {post.mediaTypes[index] === 'video' ? (
                    <Video
                      source={{ uri: mediaUrl }}
                      style={styles.postImage}
                      controls={true}
                      resizeMode="cover"
                    />
                  ) : (
                    <TouchableOpacity>
                      <Image source={{ uri: mediaUrl }} style={styles.postImage} />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </ScrollView>
          )}
          <View style={styles.actionsContainer}>
            <TouchableOpacity onPress={handleSavePost} style={styles.saveButton}>
              <Icon
                name={savedPosts.includes(post.id) ? 'bookmark' : 'bookmark-o'}
                size={25}
                color={savedPosts.includes(post.id) ? 'pink' : '#333'}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {post && (
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.commentContainer}>
              <View style={styles.commentContentContainer}>
                {item.userAvatar ? (
                  <Image source={{ uri: item.userAvatar }} style={styles.commentAvatar} />
                ) : (
                  <Image source={require('../config/assets/avatar-trang-1.png')} style={styles.commentAvatar} />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={styles.commentUsername}>{item.username}</Text>
                  {editingCommentId === item.id ? (
                    <View>
                      <TextInput
                        style={styles.input}
                        value={editedComment}
                        onChangeText={setEditedComment}
                        placeholder="Sửa bình luận..."
                      />
                      <Button title="Lưu" onPress={() => handleEditComment(item.id)} />
                    </View>
                  ) : (
                    <Text style={styles.commentContent}>{item.content}</Text>
                  )}
                  <Text style={styles.commentTimestamp}>{formatDate(item.createdAt)}</Text>
                </View>
              </View>

              {/* Hiển thị nút xóa nếu là người đăng bài viết hoặc người viết bình luận */}
              {(user && (user.uid === item.userId || user.uid === post.userId)) && (
                <View style={styles.commentActions}>
                  {user.uid === item.userId && (
                    <TouchableOpacity onPress={() => {
                      setEditingCommentId(item.id);
                      setEditedComment(item.content);
                    }}>
                      <Icon name="edit" size={20} color="blue" />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={() => handleDeleteComment(item.id)}>
                    <Icon name="trash" size={20} color="#f00" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        />
      )}


      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Viết bình luận..."
          value={newComment}
          onChangeText={setNewComment}
        />
        <Button title="Gửi" onPress={handleAddComment} />
      </View>
    </View>
  );
};

export default CommentsScreen;
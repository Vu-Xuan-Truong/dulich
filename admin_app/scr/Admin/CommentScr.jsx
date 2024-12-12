import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Image, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { collection, addDoc, doc, deleteDoc, query, onSnapshot, getDoc, where } from 'firebase/firestore';
import { auth, firestore } from '../../firebase/firebase';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from '../../scr/Admin/Layout/commentlayout';
import TruncatedText from '../services/TruncatedText';
const CommentsScreen = ({ route, navigation }) => {
  const { postId } = route.params;
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const user = auth.currentUser;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postDoc = await getDoc(doc(firestore, 'posts', postId));
        if (postDoc.exists()) {
          const postData = postDoc.data();
          const userSnapshot = await getDoc(doc(firestore, 'users', postData.userId));
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

    const unsubscribe = onSnapshot(
      query(collection(firestore, 'comments'), where('postId', '==', postId)),
      async (snapshot) => {
        const fetchedComments = await Promise.all(
          snapshot.docs.map(async (docSnapshot) => {
            const data = docSnapshot.data();
            const userDoc = await getDoc(doc(firestore, 'users', data.userId));
            const username = userDoc.exists ? userDoc.data().name : 'Unknown';
            const userAvatar = userDoc.exists ? userDoc.data().profileImageUrl : null;
            return { id: docSnapshot.id, username, userAvatar, ...data };
          })
        );
        setComments(fetchedComments); // Set all fetched comments for the postId
      }
    );

    fetchPost();
    return () => unsubscribe();
  }, [postId]);

//   const handleAddComment = async () => {
//     if (newComment.trim() === '') {
//       alert('Comment cannot be empty');
//       return;
//     }
//     try {
//       await addDoc(collection(firestore, 'comments'), {
//         postId,
//         userId: user.uid,
//         content: newComment,
//         createdAt: new Date(),
//       });
//       setNewComment('');
//     } catch (error) {
//       console.error('Error adding comment: ', error);
//     }
//   };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteDoc(doc(firestore, 'comments', commentId));
      Alert.alert('Success', 'Comment deleted successfully');
    } catch (error) {
      console.error('Error deleting comment: ', error);
      Alert.alert('Error', 'Failed to delete comment');
    }
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        {post && (
          <View style={styles.postContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Icon name="arrow-left" size={20} color="#000" />
              <Text style={styles.backButtonText}>Trở về</Text>
            </TouchableOpacity>
            {/* <Text style={styles.postDescription}>{post.description}</Text> */}
            <TruncatedText text={post.description} style={styles.postDescription} />
            <Text style={styles.postDescription}>Vị trí: {post.location}</Text>
            <Text style={styles.postDescription}>Danh mục: {post.category}</Text>
          </View>
        )}

        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.commentContainer}>
              {item.userAvatar ? (
                <Image source={{ uri: item.userAvatar }} style={styles.commentAvatar} />
              ) : (
                <Image source={require('../../config/assets/avatar-trang-1.png')} style={styles.commentAvatar} />
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.commentUsername}>{item.username}</Text>
                <Text style={styles.commentContent}>{item.content}</Text>
                <Text style={styles.commentTimestamp}>{formatDate(item.createdAt)}</Text>
              </View>
              {/* Allow admin to delete any comment */}
              <TouchableOpacity onPress={() => handleDeleteComment(item.id)}>
                <Icon name="trash" size={20} color="red" />
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 80 }} // Add padding to avoid overlap with the input
        />
{/* 
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Viết bình luận..."
            value={newComment}
            onChangeText={setNewComment}
          />
          <Button title="Gửi" onPress={handleAddComment} />
        </View> */}
      </View>
    </KeyboardAvoidingView>
  );
};

export default CommentsScreen;

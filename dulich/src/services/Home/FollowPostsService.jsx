import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// Lấy thông tin người dùng hiện tại
export const fetchCurrentUser = async () => {
  const currentUser = auth().currentUser;
  if (currentUser) {
    const userDoc = await firestore().collection('users').doc(currentUser.uid).get();
    return userDoc.exists ? { uid: currentUser.uid, ...userDoc.data() } : null;
  }
  return null;
};

// Lấy danh sách những người dùng đang theo dõi
export const fetchFollowingList = async (userId) => {
  const followingSnapshot = await firestore()
    .collection('users')
    .doc(userId)
    .collection('following')
    .get();
  return followingSnapshot.docs.map(doc => doc.id);
};

// Lấy bài viết của người dùng đang theo dõi
export const fetchPostsByFollowing = async (followingList) => {
  const snapshot = await firestore().collection('posts').orderBy('createdAt', 'desc').get();
  const posts = await Promise.all(
    snapshot.docs.map(async (doc) => {
      const postData = doc.data();
      if (followingList.includes(postData.userId)) {
        const userSnapshot = await firestore().collection('users').doc(postData.userId).get();
        const likesSnapshot = await firestore().collection('posts').doc(doc.id).collection('likes').get();
        return {
          id: doc.id,
          ...postData,
          name: userSnapshot.data()?.name || 'Unknown',
          profileImageUrl: userSnapshot.data()?.profileImageUrl || null,
          likes: likesSnapshot.docs.map(likeDoc => likeDoc.id),
        };
      }
    })
  );
  return posts.filter(post => post); // Lọc các giá trị null
};

// Xóa bài viết
export const deletePostById = async (postId) => {
  await firestore().collection('posts').doc(postId).delete();
};

// Like hoặc unlike bài viết
export const toggleLikePost = async (postId, userId, isLiked) => {
  const likeRef = firestore().collection('posts').doc(postId).collection('likes').doc(userId);
  if (isLiked) {
    await likeRef.delete();
  } else {
    await likeRef.set({});
  }
};

// Lưu hoặc gỡ lưu bài viết
export const toggleSavePost = async (postId, userId, isSaved) => {
  const savedPostRef = firestore().collection('users').doc(userId).collection('savedPosts').doc(postId);
  if (isSaved) {
    await savedPostRef.delete();
  } else {
    await savedPostRef.set({});
  }
};

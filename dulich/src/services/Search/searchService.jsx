import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import avatar from '../../config/assets/avatar-trang-1.png'
// Fetch current user information
export const fetchUser = async () => {
  try {
    const currentUser = auth().currentUser;
    if (currentUser) {
      const userDoc = await firestore().collection('users').doc(currentUser.uid).get();
      if (userDoc.exists) {
        return {
          userId: currentUser.uid,
          profileImageUrl: userDoc.data().profileImageUrl ? { uri: userDoc.data().profileImageUrl } // URL từ Firestore
          : avatar,
        };
      }
    }
  } catch (error) {
    console.error('Error fetching user: ', error);
  }
  return null;
};

// Search for posts by location
export const searchPosts = async (keyword) => {
  try {
    if (!keyword.trim()) return [];

    const postsSnapshot = await firestore()
      .collection('posts')
      .where('location', '>=', keyword)
      .where('location', '<=', keyword + '\uf8ff')
      .get();

    if (postsSnapshot.empty) return [];

    const posts = await Promise.all(postsSnapshot.docs.map(async (doc) => {
      const postData = doc.data();
      const userSnapshot = await firestore().collection('users').doc(postData.userId).get();
      const userData = userSnapshot.data();

      const likesSnapshot = await firestore().collection('posts').doc(doc.id).collection('likes').get();
      const likes = likesSnapshot.docs.map(likeDoc => likeDoc.id);

      return {
        id: doc.id,
        name: userData ? userData.name : 'Unknown',
        userId: postData.userId,
        profileImageUrl: userData ? userData.profileImageUrl : null,
        likes,
        ...postData,
      };
    }));

    return posts;
  } catch (error) {
    console.error('Error searching posts: ', error);
    return [];
  }
};

// Search for users by name
export const searchUsers = async (keyword) => {
  try {
    if (!keyword.trim()) return [];

    const usersSnapshot = await firestore()
      .collection('users')
      .where('name', '>=', keyword)
      .where('name', '<=', keyword + '\uf8ff')
      .get();

    if (usersSnapshot.empty) return [];

    return usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error searching users: ', error);
    return [];
  }
};

// Like or unlike a post
export const handleLike = async (postId, userId) => {
  const postRef = firestore().collection('posts').doc(postId);
  const likeRef = postRef.collection('likes').doc(userId);

  const postSnapshot = await postRef.get();
  if (!postSnapshot.exists) return;

  const postLikes = postSnapshot.data().likes || [];

  if (postLikes.includes(userId)) {
    // Unlike
    await likeRef.delete();
    postLikes.filter((like) => like !== userId);
  } else {
    // Like
    await likeRef.set({});
    postLikes.push(userId);
  }

  return postLikes;
};

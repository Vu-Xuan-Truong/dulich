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


export const searchPosts = async (keyword = '', category = null) => {
  try {
    let query = firestore().collection('posts');

    if (keyword.trim()) {
      query = query.where('location', '>=', keyword).where('location', '<=', keyword + '\uf8ff');
    }

    if (category) {
      query = query.where('category', '==', category);
    }

    const postsSnapshot = await query.get();
    if (postsSnapshot.empty) return [];

    const posts = await Promise.all(
      postsSnapshot.docs.map(async (doc) => {
        const postData = doc.data();

        // Fetch user data
        const userSnapshot = await firestore().collection('users').doc(postData.userId).get();
        const userData = userSnapshot.exists ? userSnapshot.data() : { name: 'Unknown', profileImageUrl: null };

        // Fetch likes
        const likesSnapshot = await firestore().collection('posts').doc(doc.id).collection('likes').get();
        const likes = likesSnapshot.docs.map((likeDoc) => likeDoc.id);

        return {
          id: doc.id,
          name: userData.name,
          userId: postData.userId,
          profileImageUrl: userData.profileImageUrl,
          likes,
          ...postData,
        };
      })
    );

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

export const handleLike = async (postId, userId) => {
  if (!postId || !userId) {
    console.error('postId hoặc userId không hợp lệ:', { postId, userId });
    return; // Thoát nếu thiếu thông tin cần thiết
  }

  const postRef = firestore().collection('posts').doc(postId);

  try {
    const postSnapshot = await postRef.get();
    if (!postSnapshot.exists) {
      console.error(`Bài viết với ID ${postId} không tồn tại.`);
      return;
    }

    const postLikes = postSnapshot.data()?.likes || [];

    if (postLikes.includes(userId)) {
      // Nếu đã like, thực hiện unlike
      await postRef.update({
        likes: firestore.FieldValue.arrayRemove(userId),
      });
      console.log(`User ${userId} đã unlike bài viết ${postId}`);
    } else {
      // Nếu chưa like, thực hiện like
      await postRef.update({
        likes: firestore.FieldValue.arrayUnion(userId),
      });
      console.log(`User ${userId} đã like bài viết ${postId}`);
    }
  } catch (error) {
    console.error('Lỗi khi xử lý like/unlike: ', error);
  }
};


// Search for posts by category
export const searchCategories = async () => {
  try {
    const categoriesSnapshot = await firestore()
      .collection('categories')
      .get();

    return categoriesSnapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error('Error fetching categories: ', error);
  }
};

export const handleSavePost = async (postId, userId) => {
  if (!postId || !userId) {
    console.error('postId hoặc userId không hợp lệ:', { postId, userId });
    return;
  }

  const userRef = firestore().collection('users').doc(userId);

  try {
    const userSnapshot = await userRef.get();
    if (!userSnapshot.exists) {
      console.error(`Người dùng với ID ${userId} không tồn tại.`);
      return;
    }

    const savedPosts = userSnapshot.data()?.savedPosts || [];

    if (savedPosts.includes(postId)) {
      // Nếu bài viết đã được lưu, thực hiện hủy lưu
      await userRef.update({
        savedPosts: firestore.FieldValue.arrayRemove(postId),
      });
      console.log(`User ${userId} đã hủy lưu bài viết ${postId}`);
    } else {
      // Nếu bài viết chưa được lưu, thực hiện lưu
      await userRef.update({
        savedPosts: firestore.FieldValue.arrayUnion(postId),
      });
      console.log(`User ${userId} đã lưu bài viết ${postId}`);
    }
  } catch (error) {
    console.error('Lỗi khi xử lý lưu bài viết: ', error);
  }
};


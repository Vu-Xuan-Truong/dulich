// src/backend/postService.js
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

// Upload file lên Firebase Storage
export const uploadFile = async (mediaUris, isMultiple = false) => {
  const user = auth().currentUser;
  if (!user) {
    alert('You must be logged in to upload media.');
    return [];
  }

  const uploadTasks = isMultiple
    ? mediaUris.map(async (uri, index) => {
        const fileExtension = uri.split('.').pop();
        const filePath = `posts/${Date.now()}-${user.uid}-${index}.${fileExtension}`; // Lưu trong thư mục posts

        const reference = storage().ref(filePath);
        const task = reference.putFile(uri);

        try {
          await task;
          return await reference.getDownloadURL();
        } catch (e) {
          console.error('Error uploading media: ', e);
          return null;
        }
      })
    : [async () => {
        const fileExtension = mediaUris.split('.').pop();
        const filePath = `posts/${Date.now()}-${user.uid}.${fileExtension}`; // Lưu trong thư mục posts

        const reference = storage().ref(filePath);
        await reference.putFile(mediaUris);
        return await reference.getDownloadURL();
      }];

  const mediaUrls = await Promise.all(uploadTasks);
  return mediaUrls.filter(url => url !== null);
};

// Xác định loại phương tiện dựa trên URL của file
export const determineMediaType = (mediaUrl) => {
  const fileExtension = mediaUrl.split('.').pop();
  return fileExtension.match(/(jpg|jpeg|png|gif)/i) ? 'image' : 'video';
};


// Lưu thông tin post vào Firestore
export const savePost = async (mediaUrls, description) => {
  const mediaTypes = mediaUrls.map(url => determineMediaType(url));

  return await firestore().collection('posts').add({
    mediaUrls,
    mediaTypes, // Lưu loại phương tiện cho mỗi URL
    description,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
};

// Lấy tất cả các post từ Firestore
export const getPosts = async () => {
  const snapshot = await firestore()
    .collection('posts')
    .orderBy('createdAt', 'desc')
    .get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Fetch categories from Firestore
export const fetchCategories = async () => {
  const categoryList = [];
  const snapshot = await firestore().collection('categories').get();
  snapshot.forEach(doc => {
    categoryList.push({ id: doc.id, name: doc.data().name });
  });
  return categoryList;
};

// Thêm một bài viết mới vào Firestore
export const addNewPostToFirestore = async (content, location, mediaUrls, selectedCategory) => {
  const user = auth().currentUser;
  const userId = user.uid;

  const userSnapshot = await firestore().collection('users').doc(userId).get();
  const userName = userSnapshot.data()?.name || 'Unknown';

  const mediaTypes = mediaUrls.map(url => determineMediaType(url));

  await firestore().collection('posts').add({
    userId,
    name: userName,
    description: content,
    location,
    mediaUrls,
    mediaTypes, // Lưu loại phương tiện cùng với URL
    category: selectedCategory,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
};

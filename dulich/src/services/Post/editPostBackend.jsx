// src/backend/postService.js
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

// Existing functions...

// Function to fetch post data
export const fetchPostData = async (postId) => {
  try {
    const postDoc = await firestore().collection('posts').doc(postId).get();
    if (postDoc.exists) {
      return postDoc.data();
    } else {
      console.warn('Post does not exist');
      return null;
    }
  } catch (error) {
    console.error('Error fetching post: ', error);
    return null;
  }
};

// Function to upload image
export const uploadImage = async (imageUri, postId) => {
  const fileName = imageUri.substring(imageUri.lastIndexOf('/') + 1);
  const storageRef = storage().ref(`postImages/${postId}/${fileName}`);
  try {
    await storageRef.putFile(imageUri);
    return await storageRef.getDownloadURL();
  } catch (error) {
    console.error('Error uploading image: ', error);
    throw error;
  }
};


// Function to save post changes
export const savePostChanges = async (postId, newDescription, newLocation, newMediaUrls, selectedCategory) => {
  try {
    await firestore().collection('posts').doc(postId).update({
      description: newDescription,
      location: newLocation,
      mediaUrls: newMediaUrls,
      category: selectedCategory, // Save the selected category
    });
  } catch (error) {
    console.error('Error saving changes: ', error);
    throw error;
  }
};


// Function to fetch categories (if you don't already have this)
export const fetchCategories = async () => {
  const categoryList = [];
  const snapshot = await firestore().collection('categories').get();
  snapshot.forEach(doc => {
    categoryList.push({ id: doc.id, name: doc.data().name });
  });
  return categoryList;
};

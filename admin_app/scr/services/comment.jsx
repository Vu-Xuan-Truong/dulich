// commentsService.js
import { firestore } from "../../firebase/firebase";

const commentsCollection = firestore().collection('comments');

export const fetchPostComments = async (postId) => {
  try {
    const snapshot = await commentsCollection.where('postId', '==', postId).orderBy('createdAt', 'asc').get();
    const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return comments;
  } catch (error) {
    console.error('Error fetching comments: ', error);
    throw error;
  }
};

export const addComment = async (postId, userId, content) => {
  try {
    await commentsCollection.add({
      postId,
      userId,
      content,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error('Error adding comment: ', error);
    throw error;
  }
};

export const editComment = async (commentId, content) => {
  try {
    await commentsCollection.doc(commentId).update({ content });
  } catch (error) {
    console.error('Error editing comment: ', error);
    throw error;
  }
};

export const deleteComment = async (commentId) => {
  try {
    await commentsCollection.doc(commentId).delete();
  } catch (error) {
    console.error('Error deleting comment: ', error);
    throw error;
  }
};
export const deletePost = async (postId) => {
  try {
    await firestore().collection('posts').doc(postId).delete();
  } catch (error) {
    console.error('Error deleting post: ', error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};
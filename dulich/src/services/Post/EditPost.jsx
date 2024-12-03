// Chỉnh sửa thông tin bài viết trong Firestore
import firestore from '@react-native-firebase/firestore';
import { determineMediaType } from './addNewPostBackend'; // Adjust the path accordingly


export const editPost = async (postId, updatedContent, updatedLocation, updatedMediaUrls, updatedCategory) => {
    try {
      const postRef = firestore().collection('posts').doc(postId);
  
      // Lấy thông tin bài viết hiện tại để so sánh
      const postSnapshot = await postRef.get();
      if (!postSnapshot.exists) {
        throw new Error('Post does not exist');
      }
  
      // Xác định loại phương tiện mới nếu mediaUrls được cập nhật
      const mediaTypes = updatedMediaUrls.map(url => determineMediaType(url));
  
      // Cập nhật bài viết
      await postRef.update({
        description: updatedContent,
        location: updatedLocation,
        mediaUrls: updatedMediaUrls,
        mediaTypes,
        category: updatedCategory,
        updatedAt: firestore.FieldValue.serverTimestamp(), // Lưu thời gian cập nhật
      });
  
      return { success: true, message: 'Post updated successfully' };
    } catch (error) {
      console.error('Error updating post: ', error);
      return { success: false, message: error.message };
    }
  };
  
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// Fetch notifications
export const fetchNotifications = async (userId) => {
  try {
    const postsSnapshot = await firestore()
      .collection('posts')
      .where('userId', '==', userId)
      .get();

    const postIds = postsSnapshot.docs.map((doc) => doc.id);

    if (postIds.length === 0) return [];

    const commentsSnapshot = await firestore()
      .collection('comments')
      .where('postId', 'in', postIds)
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get();

    const fetchedNotifications = await Promise.all(
      commentsSnapshot.docs.map(async (doc) => {
        const commentData = doc.data();

        if (commentData.userId === userId) return null;

        const postDoc = await firestore().collection('posts').doc(commentData.postId).get();
        let firstMediaUrl = null;
        let firstMediaType = null;

        if (postDoc.exists) {
          const postData = postDoc.data();
          if (postData.mediaUrls && postData.mediaUrls.length > 0) {
            firstMediaUrl = postData.mediaUrls[0];
            firstMediaType =
              postData.mediaTypes && postData.mediaTypes.length > 0 ? postData.mediaTypes[0] : null;
          }
        }

        const userDoc = await firestore().collection('users').doc(commentData.userId).get();
        const commenterName = userDoc.exists ? userDoc.data().name : 'Admin';
        const commenterAvatar = userDoc.exists ? userDoc.data().profileImageUrl : null;

        return {
          id: doc.id,
          type: 'comment',
          postId: commentData.postId,
          content: commentData.content,
          firstMediaUrl,
          firstMediaType,
          commenterName,
          commenterAvatar,
          createdAt: commentData.createdAt,
        };
      })
    );

    return fetchedNotifications.filter((item) => item !== null);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

// Fetch followers
export const fetchFollowers = async (userId) => {
  try {
    const followersSnapshot = await firestore()
      .collection('users')
      .doc(userId)
      .collection('followers')
      .get();

    const followersData = await Promise.all(
      followersSnapshot.docs.map(async (doc) => {
        const followerDoc = await firestore().collection('users').doc(doc.id).get();
        const followerData = followerDoc.exists ? followerDoc.data() : {};
        return {
          id: doc.id,
          name: followerData.name || 'UnKnown',
          profileImageUrl: followerData.profileImageUrl || 'https://via.placeholder.com/50',
        };
      })
    );

    // Fetch followed user IDs
    const followedSnapshot = await firestore()
      .collection('users')
      .doc(userId)
      .collection('following')
      .get();

    const followedIds = followedSnapshot.docs.map((doc) => doc.id);

    return { followers: followersData, followedIds };
  } catch (error) {
    console.error('Error fetching followers:', error);
    return { followers: [], followedIds: [] };
  }
};

// Handle follow/unfollow
// export const handleFollow = async (currentUserId, targetUserId, action) => {
//   try {
//     if (action === 'follow') {
//       await firestore()
//         .collection('users')
//         .doc(currentUserId)
//         .collection('following')
//         .doc(targetUserId)
//         .set({ followedAt: firestore.FieldValue.serverTimestamp() });

//       await firestore()
//         .collection('users')
//         .doc(targetUserId)
//         .collection('followers')
//         .doc(currentUserId)
//         .set({ followedAt: firestore.FieldValue.serverTimestamp() });
//     } else if (action === 'unfollow') {
//       await firestore()
//         .collection('users')
//         .doc(currentUserId)
//         .collection('following')
//         .doc(targetUserId)
//         .delete();

//       await firestore()
//         .collection('users')
//         .doc(targetUserId)
//         .collection('followers')
//         .doc(currentUserId)
//         .delete();
//     }
//   } catch (error) {
//     console.error(`Error ${action}ing user:`, error);
//   }
// };

/**
 * Handle follow action.
 * @param {string} currentUserId - The ID of the current logged-in user.
 * @param {string} followerId - The ID of the user to follow.
 */
export const handleFollow = async (currentUserId, followerId) => {
    try {
      // Add the follower to the current user's 'following' collection
      await firestore()
        .collection('users')
        .doc(currentUserId)
        .collection('following')
        .doc(followerId)
        .set({ followedAt: firestore.FieldValue.serverTimestamp() });
  
      // Add the current user to the follower's 'followers' collection
      await firestore()
        .collection('users')
        .doc(followerId)
        .collection('followers')
        .doc(currentUserId)
        .set({ followedAt: firestore.FieldValue.serverTimestamp() });
  
      //console.log(`User ${currentUserId} followed user ${followerId}`);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };
  
  /**
   * Handle unfollow action.
   * @param {string} currentUserId - The ID of the current logged-in user.
   * @param {string} followerId - The ID of the user to unfollow.
   */
  export const handleUnfollow = async (currentUserId, followerId) => {
    try {
      // Remove the follower from the current user's 'following' collection
      await firestore()
        .collection('users')
        .doc(currentUserId)
        .collection('following')
        .doc(followerId)
        .delete();
  
      // Remove the current user from the follower's 'followers' collection
      await firestore()
        .collection('users')
        .doc(followerId)
        .collection('followers')
        .doc(currentUserId)
        .delete();
  
      //console.log(`User ${currentUserId} unfollowed user ${followerId}`);
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };
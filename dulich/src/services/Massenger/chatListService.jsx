import firestore from '@react-native-firebase/firestore';
import avatar from '../../config/assets/avatar-trang-1.png'
// Function to fetch recent chats for the current user
export const fetchRecentChats = (currentUserId, setRecentChats) => {
  return firestore()
    .collection('chats')
    .where('users', 'array-contains', currentUserId)
    .orderBy('lastMessageTimestamp', 'desc')
    .onSnapshot(async snapshot => {
      const chats = await Promise.all(
        snapshot.docs.map(async doc => {
          const data = doc.data();
          const otherUserId = data.users.find(uid => uid !== currentUserId);
          const otherUserSnapshot = await firestore().collection('users').doc(otherUserId).get();
          const otherUserData = otherUserSnapshot.data();

          return {
            id: doc.id,
            otherUserId,
            otherUserName: otherUserData?.name || 'Unknown',
            otherUserProfilePicture: otherUserData?.profileImageUrl
            ? { uri: otherUserData.profileImageUrl }
            : avatar,
            
            ...data,
          };
        })
      );

      chats.sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
      setRecentChats(chats);
    });
};

// Function to delete a specific chat
// export const deleteChatById = async (chatId) => {
//   await firestore().collection('chats').doc(chatId).delete();
// };
export const deleteChatById = async (chatId, isGroup = false) => {
  try {
    if (isGroup) {
      await firestore().collection('groupchats').doc(chatId).delete();
    } else {
      await firestore().collection('chats').doc(chatId).delete();
    }
    console.log('Chat deleted successfully!');
  } catch (error) {
    console.error('Error deleting chat:', error);
  }
};

export const sendMessageToChat = async (chatId, senderId, message) => {
  const timestamp = firestore.FieldValue.serverTimestamp();

  // Add the message to the chat messages collection
  await firestore()
    .collection('chats')
    .doc(chatId)
    .collection('messages')
    .add({
      senderId,
      content: message,
      createdAt: timestamp,
    });

  // Update the chat's last message and timestamp
  await firestore()
    .collection('chats')
    .doc(chatId)
    .update({
      lastMessage: message,
      lastMessageSenderId: senderId,
      lastMessageTimestamp: timestamp,
    });
};


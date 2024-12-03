import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
// Function to fetch messages for a specific chat
export const fetchMessages = (chatId, setMessages) => {
  return firestore()
    .collection('groupchats')
    .doc(chatId)
    .collection('messages')
    .orderBy('createdAt', 'asc')
    .onSnapshot(snapshot => {
      const messagesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesList);
    });
};

// Function to fetch users
export const fetchUsers = (setUsers) => {
  return firestore()
    .collection('users')
    .onSnapshot(snapshot => {
      const usersData = {};
      snapshot.docs.forEach(doc => {
        usersData[doc.id] = doc.data();
      });
      setUsers(usersData);
    });
};

// Function to send a message
// export const sendMessageToChat = async (chatId, senderId, content) => {
//   await firestore()
//     .collection('groupchats')
//     .doc(chatId)
//     .collection('messages')
//     .add({
//       senderId,
//       content,
//       createdAt: firestore.FieldValue.serverTimestamp(),
//     });
// };

export const uploadMediaToStorage = async (file,chatId) => {
  try {
    const fileName = file.fileName || `media_${Date.now()}`;
    const reference = storage().ref(`groupchatmedia/${chatId}/${fileName}`);
    await reference.putFile(file.uri);
    return await reference.getDownloadURL();
  } catch (error) {
    console.error('Error uploading media:', error);
    return null;
  }
};

// Function to send a message
export const sendMessageToChat = async (chatId, senderId, content, type = 'text') => {
  await firestore()
    .collection('groupchats')
    .doc(chatId)
    .collection('messages')
    .add({
      senderId,
      content,
      type, // 'text', 'image', or 'video'
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
};

// Function to update the last message in a chat
export const updateLastMessage = async (chatId, senderId, userId, lastMessage) => {
  await firestore()
    .collection('groupchats')
    .doc(chatId)
    .set(
      {
        users: [senderId, userId],
        lastMessage,
        lastMessageTimestamp: firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
};
export const fetchGroupInfo = async (groupId) => {
  const groupDoc = await firestore().collection('groupchats').doc(groupId).get();
  return groupDoc.data();
};

//adduserGrchat
export const addUserToGroup = async (groupId, userId) => {
  try {
      // Reference to the group document in Firestore
      const groupRef = firestore().collection('groupchats').doc(groupId);

      // Check if the group document exists
      const groupDoc = await groupRef.get();
      if (!groupDoc.exists) {
          console.error(`Group with ID ${groupId} does not exist.`);
          return false; // Document not found, return false
      }

      // Add the userId to the members array field
      await groupRef.update({
          members: firestore.FieldValue.arrayUnion(userId)
      });

      console.log(`User ${userId} successfully added to group ${groupId}`);
      return true; // Return true if the operation was successful
  } catch (error) {
      console.error(`Error adding user to group: ${error.message}`);
      return false; // Return false if there was an error
  }
};
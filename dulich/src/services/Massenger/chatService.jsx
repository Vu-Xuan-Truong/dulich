import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';

// Function to fetch messages for a specific chat
export const fetchMessages = (chatId, setMessages) => {
  return firestore()
    .collection('chats')
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
      //console.log("Fetched users:", usersData); // Kiểm tra dữ liệu người dùng
      setUsers(usersData);
    });
};

// Function to send a message
// export const sendMessageToChat = async (chatId, senderId, content) => {
//   await firestore()
//     .collection('chats')
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
    const reference = storage().ref(`Userchat/${chatId}/${fileName}`);
    await reference.putFile(file.uri);
    return await reference.getDownloadURL();
  } catch (error) {
    console.error('Error uploading media:', error);
    return null;
  }
};

// Function to send a message with support for media
export const sendMessageToChat = async (chatId, senderId, content, type = 'text') => {
  await firestore()
    .collection('chats')
    .doc(chatId)
    .collection('messages')
    .add({
      senderId,
      content,
      type, // Type can be 'text', 'image', or 'video'
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
};

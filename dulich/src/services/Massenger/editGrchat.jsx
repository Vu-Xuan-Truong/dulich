import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

// Fetch group data
export const fetchGroupData = async (groupId, setGroupName, setGroupImage, setIsCreator, setUsers, currentUserId) => {
  try {
    const groupDoc = await firestore().collection('groupchats').doc(groupId).get();
    const groupData = groupDoc.data();

    setGroupName(groupData.name);
    setGroupImage(groupData.imageUrl);

    const memberIds = groupData.members;
    setIsCreator(memberIds[0] === currentUserId);

    const memberList = await Promise.all(
      memberIds.map(async (userId) => {
        const userDoc = await firestore().collection('users').doc(userId).get();
        const userData = userDoc.data();
        return {
          id: userId,
          name: userData.name || 'Unknown',
          profileImageUrl: userData.profileImageUrl || null,
        };
      })
    );
    setUsers(memberList);
  } catch (error) {
    console.log('Error fetching group data:', error);
  }
};

// Save changes to group
export const saveChangesToGroup = async (groupId, groupName, groupImage, navigation) => {
  let groupImageUrl = groupImage;
  if (groupImage && !groupImage.startsWith('https')) {
    try {
      groupImageUrl = await uploadGroupImage(groupImage);
    } catch (error) {
      console.log('Error uploading image:', error);
      return;
    }
  }

  if (groupName.trim()) {
    try {
      await firestore().collection('groupchats').doc(groupId).update({
        name: groupName,
        imageUrl: groupImageUrl,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
      navigation.navigate('ListChatsScreen', { refresh: true });
    } catch (error) {
      console.log('Error updating group chat:', error);
    }
  }
};

// Add a new user to the group
export const addUserToGroup = async (groupId, newUserId, setUsers, setNewUserModalVisible) => {
  try {
    await firestore().collection('groupchats').doc(groupId).update({
      members: firestore.FieldValue.arrayUnion(newUserId),
    });

    const newUserDoc = await firestore().collection('users').doc(newUserId).get();
    const newUser = {
      id: newUserId,
      name: newUserDoc.data().name || 'Unknown',
      profileImageUrl: newUserDoc.data().profileImageUrl || null,
    };

    setUsers((prevUsers) => [...prevUsers, newUser]);
    setNewUserModalVisible(false);
  } catch (error) {
    console.log('Error adding user:', error);
  }
};

// Remove a member from the group
export const removeMemberFromGroup = async (groupId, userId, setUsers) => {
  try {
    await firestore().collection('groupchats').doc(groupId).update({
      members: firestore.FieldValue.arrayRemove(userId),
    });
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  } catch (error) {
    console.log('Error removing member:', error);
  }
};

// Function to upload group image to Firebase Storage
const uploadGroupImage = async (imageUri) => {
  const imageName = `groupImages/${auth().currentUser.uid}_${Date.now()}.jpg`;
  const storageRef = storage().ref(imageName);
  await storageRef.putFile(imageUri);
  return await storageRef.getDownloadURL();
};

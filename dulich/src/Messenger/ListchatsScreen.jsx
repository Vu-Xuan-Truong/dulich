import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Alert, RefreshControl, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../layput/Massenger/layoutListchat';
import { fetchRecentChats, deleteChatById } from '../services/Massenger/chatListService';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const ListChatsScreen1 = ({ navigation, route }) => {
  const [recentChats, setRecentChats] = useState([]);
  const [groupChats, setGroupChats] = useState([]); // Add state for group chats
  const [refreshing, setRefreshing] = useState(false);
  const [currentTab, setCurrentTab] = useState('individual'); // State to track current tab
  const currentUser = auth().currentUser;
  const [menuVisible, setMenuVisible] = useState(null);
  const [groupMenuVisible, setGroupMenuVisible] = useState(false);


  useEffect(() => {
    if (currentUser) {
      const unsubscribeIndividual = firestore()
        .collection('chats')
        .where('users', 'array-contains', currentUser.uid) // Lọc các cuộc trò chuyện mà người dùng hiện tại tham gia
        .onSnapshot(async (snapshot) => {
          const chatPromises = snapshot.docs.map(async (doc) => {
            const chatData = doc.data();
            const otherUserId = chatData.users.find(uid => uid !== currentUser.uid); // Tìm người dùng khác

            // Lấy thông tin người dùng khác từ Firestore
            const otherUserSnapshot = await firestore().collection('users').doc(otherUserId).get();
            const otherUserData = otherUserSnapshot.data();

            // Lấy tin nhắn gần nhất từ subcollection 'messages'
            const lastMessageSnapshot = await firestore()
              .collection('chats')
              .doc(doc.id)
              .collection('messages')
              .orderBy('createdAt', 'desc')
              .limit(1)
              .get();

            const lastMessage = lastMessageSnapshot.docs[0]?.data() || null;

            return {
              id: doc.id,
              ...chatData,
              otherUserName: otherUserData ? otherUserData.name : 'Unknown User', // Hiển thị tên người dùng khác
              otherUserProfilePicture: otherUserData ? otherUserData.profileImageUrl : null, // Hiển thị ảnh đại diện của người dùng khác
              lastMessage: lastMessage ? lastMessage.content : 'No messages yet',
              lastMessageAt: lastMessage ? lastMessage.createdAt : null,
            };
          });

          const individualChats = await Promise.all(chatPromises);
          setRecentChats(individualChats);
        }, error => {
          console.error("Error fetching individual chats: ", error);
        });

      // Fetch group chats the user is part of
      const unsubscribeGroup = firestore()
        .collection('groupchats')
        .where('members', 'array-contains', currentUser.uid)
        .onSnapshot(snapshot => {
          const groupChatPromises = snapshot.docs.map(async (doc) => {
            // Fetch data for group chat
          });

          Promise.all(groupChatPromises).then((groupChats) => {
            setGroupChats(groupChats);
          });
        }, error => {
          console.error("Error fetching group chats: ", error);
        });

      // Fetch public groups
      const unsubscribePublicGroups = firestore()
        .collection('groupchats')
        .where('isPublic', '==', true) // Assume `isPublic` field indicates a public group
        .onSnapshot(snapshot => {
          const publicGroupPromises = snapshot.docs.map(async (doc) => {
            const lastMessageSnapshot = await firestore()
              .collection('groupchats')
              .doc(doc.id)
              .collection('messages')
              .orderBy('createdAt', 'desc')
              .limit(1)
              .get();

            const lastMessage = lastMessageSnapshot.docs[0]?.data() || null;

            return {
              id: doc.id,
              ...doc.data(),
              lastMessage: lastMessage ? lastMessage.content : 'No messages yet',
              lastMessageAt: lastMessage ? lastMessage.createdAt : null,
            };
          });

          Promise.all(publicGroupPromises).then((publicGroups) => {
            setGroupChats(prevChats => [
              ...prevChats.filter(chat => chat && chat.members.includes(currentUser.uid)),

              ...publicGroups
            ]);
          });
        }, error => {
          console.error("Error fetching public group chats: ", error);
        });

      return () => {
        unsubscribeIndividual();
        unsubscribeGroup();
        unsubscribePublicGroups();
      };
    }
  }, [currentUser]);




  // Check if we need to refresh the list (from the route)
  useEffect(() => {
    if (route.params?.refresh) {
      onRefresh(); // Gọi hàm làm mới danh sách khi có tham số refresh
    }
  }, [route.params?.refresh]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRecentChats(currentUser.uid, setRecentChats); // Làm mới danh sách trò chuyện, bao gồm cả nhóm
    setRefreshing(false);
  };

  const closeGroupMenu = () => {
    setGroupMenuVisible(false);
  };

  // const confirmDelete = (chatId) => {
  //   Alert.alert(
  //     'Xóa Cuộc Trò Chuyện',
  //     'Bạn có chắc chắn muốn xóa cuộc trò chuyện này không?',
  //     [
  //       { text: 'Hủy', style: 'cancel' },
  //       { text: 'Xóa', onPress: () => deleteChat(chatId) },
  //     ],
  //     { cancelable: false }
  //   );
  // };
  const confirmDelete = (chatId, isGroup) => {
    Alert.alert(
      'Xóa Cuộc Trò Chuyện',
      'Bạn có chắc chắn muốn xóa cuộc trò chuyện này không?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa', onPress: () => deleteChat(chatId, isGroup) },
      ],
      { cancelable: false }
    );
  };
  

  // const deleteChat = async (chatId) => {
  //   await deleteChatById(chatId);
  //   Alert.alert('Đã xóa cuộc trò chuyện!');
  //   setMenuVisible(null);
  // };
  const deleteChat = async (chatId, isGroup) => {
    await deleteChatById(chatId, isGroup);
    Alert.alert('Đã xóa cuộc trò chuyện!');
    setMenuVisible(null);
  };
  

  const navigateToChat = (chat) => {

    if (chat.isGroup) {
      navigation.navigate('GrMess', { chatId: chat.id });
    } else {
      const otherUserId = chat.users.find(uid => uid !== currentUser.uid); // Lấy userId của người dùng khác
      navigation.navigate('ChatScreen', { chatId: chat.id, userId: otherUserId }); // Truyền userId của người dùng khác
    }
  };




  // Function to render individual or group chats based on selected tab
  const renderChats = () => {
    const chatsToShow = (currentTab === 'individual' ? recentChats : groupChats).filter(Boolean); // Filter out undefined items

    return (
      <FlatList
        data={chatsToShow}
        keyExtractor={(item) => `${item.id}-${item.isGroup}`}
        renderItem={({ item }) => (
          item && (
            <View>
              <TouchableOpacity style={styles.chatContainer} onPress={() => navigateToChat(item)}>
                {/* Check if the chat is a group chat or individual */}
                <Image
                  source={
                    item.isGroup
                      ? item.imageUrl && typeof item.imageUrl === 'string' ? { uri: item.imageUrl } : null
                      : item.otherUserProfilePicture && typeof item.otherUserProfilePicture === 'string'
                        ? { uri: item.otherUserProfilePicture }
                        : null
                  }
                  style={styles.profileImage}
                />


                <View style={styles.chatDetails}>
                  <Text style={styles.chatUser}>
                    {item.isGroup ? item.name : item.otherUserName}
                  </Text>
                  <Text style={styles.lastMessage}>
                    {item.lastMessage || 'No messages yet'}
                  </Text>
                </View>
                <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(item.id)}>
                  <Text style={styles.menuText}>...</Text>
                </TouchableOpacity>
              </TouchableOpacity>
              {menuVisible === item.id && (
                <View style={styles.menu}>
                  <TouchableOpacity 
                  //onPress={() => confirmDelete(item.id)}
                  onPress={() => confirmDelete(item.id, item.isGroup)}
                  >
                    <Text style={styles.menuItem}>Xóa</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    );
  };


  return (
    <TouchableWithoutFeedback onPress={() => {
      setMenuVisible(null); // Đóng menu khi nhấn ra ngoài
      closeGroupMenu(); // Đóng nhóm menu khi nhấn ra ngoài
      Keyboard.dismiss(); // Ẩn bàn phím nếu đang mở
    }}>
      <View style={styles.container}>
        {/* Header with search and group chat icons */}
        <View style={styles.header}>
          <Text style={styles.title}>Trò chuyện</Text>
          <Icon
            name="search-outline"
            size={24}
            color="black"
            style={styles.searchIcon}
            onPress={() => navigation.navigate('SearchUsersScreen')}
          />
          <Icon
            name="people-outline"
            size={24}
            color="black"
            style={styles.groupChatIcon}
            onPress={() => setGroupMenuVisible(true)}
          />
        </View>

        {/* Horizontal Menu */}
        <View style={styles.horizontalMenu}>
          <TouchableOpacity
            style={[
              styles.menuButtonHorizontal,
              currentTab === 'individual' && styles.activeTab,
            ]}
            onPress={() => setCurrentTab('individual')}
          >
            <Text style={styles.menuTextHorizontal}>Cá nhân</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.menuButtonHorizontal,
              currentTab === 'group' && styles.activeTab,
            ]}
            onPress={() => setCurrentTab('group')}
          >
            <Text style={styles.menuTextHorizontal}>Nhóm chat</Text>
          </TouchableOpacity>
        </View>

        {/* Render the chats based on the selected tab */}
        {renderChats()}

        {groupMenuVisible && (
          <View style={styles.groupMenu}>
            <TouchableOpacity onPress={() => {
              closeGroupMenu();
              navigation.navigate('GroupChat');
            }}>
              <Text style={styles.menuItem}>Tạo nhóm trò chuyện</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ListChatsScreen1;

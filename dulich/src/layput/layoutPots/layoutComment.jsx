import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 15,
      backgroundColor: '#f5f5f5',
    },
    postContainer: {
      marginBottom: 15,
      padding: 15,
      backgroundColor: '#fff',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#ddd',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    postHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    avatar: {
      width: 45,
      height: 45,
      borderRadius: 22.5,
      marginRight: 10,
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    postUsername: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    backButtonText: {
      marginLeft: 5,
      fontSize: 18,
      color: '#007BFF',
    },
    postActions: {
      flexDirection: 'row',
    },
    postImage: {
      width: 150,
      height: 150,
      marginRight: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ddd',
    },
    postDate: {
      fontSize: 13,
      color: 'gray',
      marginRight: 40, // Khoảng cách cố định với phần tử bên cạnh
    },
    postCategory: {
      fontSize: 16,
      color: 'gray',
    },
    rowContainer: {
      flexDirection: 'row', 
      alignItems: 'center',
    },
    postDescription: {
      fontSize: 16,
      color: '#444',
      marginVertical: 3,
    },
    
    commentContainer: {
      flexDirection: 'row', // Đặt flexDirection là 'row'
      alignItems: 'flex-start', // Đảm bảo các phần tử được căn chỉnh ở đầu hàng
      padding: 12,
      marginVertical: 6,
      backgroundColor: '#fff',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ddd',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    commentContentContainer: {
      flex: 1,
      flexDirection: 'row', // Đặt flexDirection là 'row'
      alignItems: 'flex-start', // Đảm bảo các phần tử được căn chỉnh ở đầu hàng
    },
    commentAvatar: {
      width: 35,
      height: 35,
      borderRadius: 17.5,
      marginRight: 10,
    },
    commentUsername: {
      fontSize: 15,
      fontWeight: 'bold',
      color: '#333',
    },
    commentContent: {
      fontSize: 15,
      color: '#666',
      marginTop: 5,
      flex: 1,
    },
    commentActions: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 10, // Thêm khoảng cách từ nội dung bình luận
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderColor: '#ddd',
    },
    input: {
      flex: 1,
      height: 45,
      borderColor: '#ddd',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 12,
      marginRight: 10,
      backgroundColor: '#fafafa',
    },
    iconedit: {
      marginRight: 10,
    },
    commentTimestamp: {
      fontSize: 12,
      color: '#888', // Change to your desired color
      marginTop: 4, // Spacing between comment content and timestamp
    },
    video: {
      width: 160,
      height: 160,
      borderRadius: 12,
      marginRight: 10,
    },
    mediaContainer: {
      marginVertical: 8,
    },
    mediaWrapper: {
      marginRight: 8,
    },
    saveButton:{
      flexDirection: 'row',
      left:333,
    },
    menuOptionText: {
      fontSize: 16,
      padding: 10,
      color: '#333',
    },
  });
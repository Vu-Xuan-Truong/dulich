import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({

    container: {
      flex: 1,
      padding: 20,
    },
    searchInput: {
      borderWidth: 1,
      borderColor: '#ddd',
      padding: 10,
      borderRadius: 8,
      marginBottom: 20,
    },
    postContainer: {
      marginBottom: 20,
      padding: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ddd',
    },
    postHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 10,
    },
    postUsername: {
      fontSize: 14,
      color: '#333',
      marginBottom: 5,
    },
    mediaContainer: {
      marginBottom: 10,
    },
    mediaWrapper: {
      marginRight: 8,
    },
    video: {
      width: 160,
      height: 160,
      borderRadius: 12,
      marginRight: 10,
    },
    postMedia: {
      width: 150,
      height: 150,
      marginRight: 10,
      borderRadius: 8,
    },
    postDescription: {
      fontSize: 16,
      color: '#555',
    },
    postLocation: {
      fontSize: 14,
      color: '#777',
      marginTop: 5,
    },
    noResults: {
      textAlign: 'center',
      fontSize: 16,
      color: '#777',
    },
    userContainer: {
      marginBottom: 20,
    },
    userItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      borderBottomColor: '#ddd',
      borderBottomWidth: 1,
      backgroundColor: '#fff',
      borderRadius: 10,
      marginVertical: 5,
      elevation: 2,
    },
    userName: {
      fontSize: 18,
      marginLeft: 10,
      color: '#333',
    },
    backButton: {
      flexDirection: 'row',
      fontSize: 15,
      height:40,
      alignItems: 'center',
    },
    backButtonText: {
      marginLeft: 5,
      fontSize: 15,
      color: '#000',
    },
    actionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 10,
    },
    likeCount: {
      fontSize: 16,
      color: '#555',
      marginLeft: 8,
    },
    commentButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 15,
    },
    commentCount: {
      fontSize: 16,
      color: '#555',
      marginLeft: 8,
    },
    rowContainer: {
      flexDirection: 'row', 
      alignItems: 'center',
    },
    postDate: {
      fontSize: 13,
      color: 'gray',
      marginRight: 20, // Khoảng cách cố định với phần tử bên cạnh
    },
    postCategory: {
      fontSize: 16,
      color: 'gray',
    },
    shareButton:{
      left:10,
    },
    saveButton: {
      marginLeft: 'auto', // Align to the right
    },
    pickerContainer: {
      marginVertical: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      overflow: 'hidden',
    },
    picker: {
      height: 50,
      width: '100%',
    },
    noResultsText: {
      textAlign: 'center',
      marginTop: 20,
      color: '#888',
    },
    
  });



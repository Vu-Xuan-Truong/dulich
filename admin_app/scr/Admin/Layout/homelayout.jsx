import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    filterContainer: {
      marginBottom: 20,
    },
    filterInput: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 8,
      borderRadius: 5,
      marginBottom: 10,
    },
    postContainer: {
      padding: 10,
      backgroundColor: '#f1f1f1',
      marginBottom: 10,
      borderRadius: 5,
    },
    userContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10,
    },
    userName: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    postcategory:{
      fontSize: 16,
      color: 'gray',
      marginTop: 32,
      right:75,
    },
    postDescription: {
      fontSize: 16,
      color: '#333',
    },
    deleteIcon: {
      marginTop: 10,
      alignSelf: 'flex-end',
    },
    postMedia: {
      width: 160,
      height: 160,
      borderRadius: 12,
      marginRight: 10,
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
      postDate: {
        fontSize: 13,
        color: 'gray',
        marginTop: 32,
        right:85,
      },
      commentIcon: { marginHorizontal: 8 },
      iconContainer: {
        flexDirection: 'row', // Align icons in a row
        alignItems: 'center', // Vertically center the icons
        justifyContent: 'space-between', // Optional: space the icons out if needed
      },

  });
  
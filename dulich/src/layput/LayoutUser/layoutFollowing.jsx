import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 25,
      left:40,
      fontWeight: 'bold',
      },
    
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
    },
    profileImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10,
    },
    textContainer: {
      flex: 1,
    },
    itemText: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    followButton: {
      backgroundColor: '#007BFF',
      padding: 5,
      borderRadius: 5,
      alignItems: 'center',
    },
    followButtonText: {
      color: '#fff',
      fontSize: 16,
    },
    backButton: {
      flexDirection: 'row',
      fontSize: 20,
      height:40,
      alignItems: 'center',
    },
    backButtonText: {
      marginLeft: 5,
      fontSize: 20,
      color: '#000',
    },
  });
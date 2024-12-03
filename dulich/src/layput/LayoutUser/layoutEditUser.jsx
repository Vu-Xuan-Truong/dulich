import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#fff',
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      alignSelf: 'center',
      marginBottom: 20,
      borderWidth: 1,
      borderColor: '#000',
      top:15,
    },
    editIcon: {
      position: 'absolute',
      right: 140,
      bottom: 10,
      backgroundColor: '#fff',
      padding: 5,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#000',
    },
    input: {
      height: 50,
      borderColor: '#ddd',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginVertical: 10,
    },
    backButton: {
      flexDirection: 'row',
      fontSize: 20,
      height: 40,
      alignItems: 'center',
    },
    backButtonText: {
      marginLeft: 5,
      fontSize: 20,
      color: '#000',
    },
    title: {
      fontSize: 25,
      left: 40,
      fontWeight: 'bold',
    },
    button: {
      backgroundColor: '#007BFF', // Primary color
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginVertical: 10,
      width: '100%',
      alignItems: 'center',
    },
    buttonText: {
      color: '#FFFFFF', // Text color
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    backgroundImage: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      width: '90%',
      paddingHorizontal: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.8)', // Slightly transparent background
      borderRadius: 10,
      padding: 10,
      alignItems: 'center',
      top:90,
    },
    title: {
      fontSize: 30,
      marginBottom: 20,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 20,
      width: '100%',
    },
    icon: {
      marginRight: 10,
    },
    input: {
      flex: 1,
      height: 40,
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
    text: {
      fontSize: 18,
      textAlign: 'center',
      color: '#000000', // Text color for links
      marginTop: 20,
    },
  });
  
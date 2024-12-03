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
      top: -70,
    },
    logoContainer: {
      top: 100,
      alignItems: 'center',
      marginBottom: 10,
    },
    logo: {
      top: -110,
      width: 400,
      height: 400,
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
      position: 'relative', // To position the icon inside the TextInput
    },
    icon: {
      position: 'absolute',
      left: 10,
      zIndex: 1,
    },
    input: {
      flex: 1,
      height: 40,
      paddingLeft: 40, // Padding to prevent text overlap with icon
    },
    passwordIcon: {
      position: 'absolute',
      right: 10,
      zIndex: 1,
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
    divider: {
      textAlign: 'center',
      marginVertical: 10,
      color: 'gray',
    },
    text: {
      fontSize: 18,
      textAlign: 'right',
      color: '#000000', // Text color for links
      marginTop: 25,
    },
  });
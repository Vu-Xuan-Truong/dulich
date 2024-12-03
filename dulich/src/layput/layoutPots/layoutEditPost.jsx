import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 15,
      backgroundColor: '#f5f5f5',
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
    },
    backButtonText: {
      marginLeft: 10,
      fontSize: 16,
      color: '#000',
    },
    formContainer: {
      flex: 1,
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: 10,
      marginBottom: 5,
    },
    input: {
      height: 40,
      borderColor: '#ddd',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 10,
      marginBottom: 10,
    },
    input1: {
      height: 20,
      borderColor: '#ddd',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 5,
      marginBottom: 5,
    },
    imageContainer: {
      marginRight: 10,
      position: 'relative',
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: 8,
    },
    removeButton: {
      position: 'absolute',
      top: 5,
      right: 5,
      backgroundColor: 'red',
      padding: 5,
      borderRadius: 15,
    },
    removeButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 14,
    },
    addButton: {
      backgroundColor: '#007bff',
      paddingVertical: 10,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 15,
    },
    addButtonText: {
      color: '#fff',
      fontSize: 16,
    },
    saveButton: {
      backgroundColor: '#28a745',
      paddingVertical: 10,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 20,
    },
    saveButtonText: {
      color: '#fff',
      fontSize: 16,
    },
    title:{
      fontSize: 26,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
      color: '#333',
    }
  });
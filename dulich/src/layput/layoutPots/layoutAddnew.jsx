import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f7f7f7',
    },
    title: {
      fontSize: 26,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
      color: '#333',
    },
    input: {
      height: 120,
      borderColor: '#ddd',
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 15,
      paddingHorizontal: 15,
      paddingVertical: 10,
      backgroundColor: '#fff',
      textAlignVertical: 'top',
    },
    input1: {
      height: 60,
      borderColor: '#ddd',
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 15,
      paddingHorizontal: 15,
      paddingVertical: 10,
      backgroundColor: '#fff',
      textAlignVertical: 'top',
    },
    mediaContainer: {
      marginVertical: 15,
    },
    imageWrapper: {
      position: 'relative',
      marginRight: 10,
    },
    image: {
      width: 120,
      height: 120,
      borderRadius: 10,
    },
    removeButton: {
      position: 'absolute',
      top: 5,
      right: 5,
      backgroundColor: '#ff4d4d',
      padding: 5,
      borderRadius: 20,
      elevation: 2,
    },
    removeButtonText: {
      color: '#fff',
      fontSize: 16,
    },
    selectButton: {
      backgroundColor: '#007bff',
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 20,
    },
    selectButtonText: {
      color: '#fff',
      fontSize: 16,
    },
    submitButton: {
      backgroundColor: '#28a745',
      paddingVertical: 15,
      borderRadius: 8,
      alignItems: 'center',
    },
    disabledButton: {
      backgroundColor: '#d6d6d6',
    },
    submitButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    pickerContainer: {
      marginVertical: 10,
      backgroundColor: '#f0f0f0',
      borderRadius: 5,
    },
    picker: {
      height: 50,
      width: '100%',
    },
    video: {
      width: 120,
      height: 120, // Adjust size as necessary
      margin: 5,
    },
    suggestionItem: {
      padding: 10,
      backgroundColor: '#f0f0f0',
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    suggestionText: {
      fontSize: 16,
    },
  });
  
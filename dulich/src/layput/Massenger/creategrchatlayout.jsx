import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#F7F9FC',
    },
    input: {
      borderBottomWidth: 1,
      borderBottomColor: '#B0BEC5', // Softer border color
      marginBottom: 20,
      fontSize: 18,
      padding: 10,
      borderRadius: 5, // Rounded input
      backgroundColor: '#FFFFFF', // Input background
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    pickImageButton: {
      marginBottom: 20,
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: '#007BFF',
      borderRadius: 8, // More rounded corners
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 3, // Shadow effect
    },
    buttonText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      fontSize: 16,
    },
    imageStyle: {
      width: 120,
      height: 120,
      borderRadius: 60,
      marginBottom: 20,
      borderWidth: 2,
      borderColor: '#007BFF', // Border around image
    },
    userItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 12,
      backgroundColor: '#FFFFFF',
      borderRadius: 8,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    selectedUserItem: {
      backgroundColor: '#B2EBF2', // Highlight for selected users
    },
    userRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      marginRight: 12,
      borderWidth: 1,
      borderColor: '#B0BEC5', // Border for avatars
    },
    userName: {
      fontSize: 18, // Slightly larger font
      fontWeight: '500', // Medium weight for better readability
    },
    checkMark: {
      fontSize: 20,
      color: '#007BFF',
    },
    groupTypeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 15,
    },
    groupTypeButton: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      backgroundColor: '#C0C0C0', // Change to a blue color for group type buttons
      marginHorizontal: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    
    activeGroupType: {
      backgroundColor: '#FF0000', // Change to an orange color when active
      color: 'white',
    },
});

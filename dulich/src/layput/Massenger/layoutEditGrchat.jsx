// EditGroupChatScreenStyles.js
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F7F9FC', // Light background color for a modern look
  },
  textInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc', // Softer border color
    marginBottom: 20,
    fontSize: 20,
    padding: 10, // Added padding for better touch experience
  },
  buttonText: {
    color: '#007BFF', // Bootstrap primary color
    fontWeight: 'bold', // Emphasize button text
  },
  greenText: {
    color: '#28A745', // Bootstrap success color
    fontWeight: 'bold',
  },
  imageStyle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#007BFF', // Border around the image for emphasis
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Slightly darker overlay for modals
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000', // Adding shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Elevation for Android
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333', // Darker title for contrast
  },
  modalTextInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    padding: 10,
  },
  memberItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  memberName: {
    fontSize: 16,
    flex: 1,
  },
  removeButton: {
    padding: 5,
    backgroundColor: '#FF6B6B', // Soft red color for the remove button
    borderRadius: 5,
  },
  matchingUserItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  imageIcon: {
    position: 'absolute',
    bottom: 5, // Adjusted for a better look
    right: 110, // Adjusted position to be closer to the bottom right corner
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Slightly darker background for contrast
    borderRadius: 30,
    padding: 8, // Reduced padding for a smaller icon button
    elevation: 2, // Shadow effect for the icon
  },
});

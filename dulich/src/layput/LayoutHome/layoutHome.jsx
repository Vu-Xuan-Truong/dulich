// HomeScreenStyles.js
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  title2: {
    fontSize: 24,
    top:-10,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
    marginVertical: 1,
  },
  iconsContainer: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 15,
  },
  avatar1: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  postContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 20,
    padding: 15,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 10,
  },
  postUsername: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  mediaContainer: {
    marginBottom: 15,
  },
  postMedia: {
    width: 160,
    height: 160,
    borderRadius: 12,
    marginRight: 10,
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
  rowContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
  },
  
  postDescription: {
    fontSize: 16,
    color: '#444',
    marginVertical: 3,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  saveButton: {
    marginLeft: 'auto', // Align to the right
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
  optionText: {
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f0f0f0', // Màu nền cho menu
    borderBottomWidth: 1,
    borderBottomColor: '#ccc', // Đường viền
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 1,
  },
  shareButton:{
    left:10,
  },
  menuOptionText: {
    fontSize: 16,
    padding: 10,
    color: '#333',
  },
  
});

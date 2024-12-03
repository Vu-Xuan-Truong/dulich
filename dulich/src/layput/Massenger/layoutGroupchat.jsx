import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backIcon: {
    marginLeft: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    //right:40,
    flex: 1, // Chiếm hết không gian còn lại
    justifyContent: 'center', // Căn giữa cho ảnh và tên nhóm
  },
  groupImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10, // Khoảng cách giữa ảnh và tên
    right: 40,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    right: 35,
  },
  menuIcon: {
    marginRight: 10,
  },

  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 5,
  },
  sentMessage: {
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
  },
  messageContent: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#ECECEC',
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: 'gray',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  userName: {
    fontWeight: 'bold',
  },
  backIcon: {
    marginRight: 10,
  },
  imageMessage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 5,
  },
  videoMessage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 5,
  },
  mediaButton: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
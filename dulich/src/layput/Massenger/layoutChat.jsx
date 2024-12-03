import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    
    recipientInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 10,
    },
    recipientAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 10,
    },
    recipientName: {
      fontSize: 16,
      fontWeight: 'bold',
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
    width: 150,
    height: 150,
    borderRadius: 8,
    marginVertical: 5,
  },
  videoMessage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginVertical: 5,
  },
  mediaButton: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  });
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0D0F2A' },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 20,
      backgroundColor: '#00BFFF',
      borderBottomColor: '#404377',
      borderBottomWidth: 1,
    },
    backButton: { padding: 8 },
    title: { fontSize: 24, color: '#ffffff', fontWeight: 'bold' },
    newChatButton: { padding: 8 },
    chatContainer: {
      flex: 1,
      backgroundColor: '#ffffff',
      borderRadius: 12,
      padding: 10,
      margin: 10,
    },
    messagesContainer: { paddingVertical: 10 },
    messageBubble: {
      maxWidth: '75%',
      padding: 12,
      borderRadius: 20,
      marginBottom: 8,
    },
    userBubble: {
      alignSelf: 'flex-end',
      backgroundColor: '#A9A9A9', // White background for user message
      borderBottomRightRadius: 0,
    },
    botBubble: {
      alignSelf: 'flex-start',
      backgroundColor: '#A9A9A9', // Light grey background for bot message
      borderBottomLeftRadius: 0,
    },
    loadingContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 10 },
    inputContainer: {
      flexDirection: 'row',
      padding: 10,
      borderTopWidth: 1,
      borderColor: '#ffffff',
      backgroundColor: '#ffffff',
    },
    input: {
      flex: 1,
      padding: 12,
      borderRadius: 24,
      backgroundColor: '#A9A9A9',
      color: '#FFF',
      marginRight: 8,
    },
    sendButton: {
      backgroundColor: '#4A4FFF',
      padding: 12,
      borderRadius: 24,
      justifyContent: 'center',
    },
    markdownStyle: {
      body: { fontSize: 16, color: '#000' },
    },
  });
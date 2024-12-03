import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import Markdown from 'react-native-markdown-display';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { styles } from '../../layput/Massenger/layoutchatbot';
const ChatbotScreen = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const user = auth().currentUser;

  useEffect(() => {
    const loadMessages = async () => {
      if (user) {
        const chatRef = firestore().collection('chatbots').doc(user.uid);
        const chatDoc = await chatRef.get();

        if (chatDoc.exists) {
          setMessages(chatDoc.data().messages || []);
        }
      }
    };
    loadMessages();
  }, [user]);

  const saveMessagesToFirebase = async (newMessages) => {
    if (user) {
      const chatRef = firestore().collection('chatbots').doc(user.uid);
      await chatRef.set({
        userId: user.uid,
        messages: newMessages,
      });
    }
  };

  const handleSendMessage = async () => {
    if (input.trim()) {
      const newMessages = [...messages, { text: input, user: true }];
      setMessages(newMessages);
      setInput('');

      try {
        setLoading(true);
        const response = await axios.post(
          //'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyDW1IY5mDrhvGrQX8Gr-85jTOKB_tJLFJM',
          'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=OPENAI_API_KEY',
          {
            contents: [
              {
                parts: [{ text: input }],
              },
            ],
          }
        );
        const botResponse = response.data.candidates[0].content.parts[0].text;
        setLoading(false);
        const updatedMessages = [...newMessages, { text: botResponse, user: false }];
        setMessages(updatedMessages);
        saveMessagesToFirebase(updatedMessages);
      } catch (error) {
        setLoading(false);
        setMessages([...newMessages, { text: 'Error: Could not get response from AI', user: false }]);
      }
    }
  };

  const handleNewChatSession = () => {
    setMessages([]);
    saveMessagesToFirebase([]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>AI ChatBot</Text>
        <TouchableOpacity style={styles.newChatButton} onPress={handleNewChatSession}>
          <Icon name="trash" size={24} color="red" />
        </TouchableOpacity>
      </View>
      <View style={styles.chatContainer}>
        <ScrollView contentContainerStyle={styles.messagesContainer}>
          {messages.map((msg, index) => (
            <View key={index} style={[styles.messageBubble, msg.user ? styles.userBubble : styles.botBubble]}>
              <Markdown style={styles.markdownStyle}>{msg.text}</Markdown>
            </View>
          ))}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF7F50" />
              <Text>Loading...</Text>
            </View>
          )}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nhập văn bản..."
            placeholderTextColor="#ffffff"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSendMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Icon name="paper-plane" size={25} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};



export default ChatbotScreen;

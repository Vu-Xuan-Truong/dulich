import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const ReportScreen = ({ route, navigation }) => {
  const { postId } = route.params;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [reportTitles, setReportTitles] = useState([]);

  useEffect(() => {
    const fetchReportTitles = async () => {
      try {
        const querySnapshot = await firestore().collection('reportTitles').get();
        const titles = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
        }));
        setReportTitles(titles);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch report titles');
      }
    };

    fetchReportTitles();
  }, []);

  const handleSubmit = async () => {
    if (!title || !content) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const currentUser = auth().currentUser;

      await firestore().collection('reports').add({
        postId,
        title,
        content,
        userId: currentUser.uid,
        createdAt: firestore.FieldValue.serverTimestamp(),
        status: 'Đang xử lý',
      });

      Alert.alert('Thông báo', 'Gửi báo cáo vi phạm thành công!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Lỗi', 'Gửi thất bại');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>{'◀️'} Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gửi Tố Cáo Bài Viết</Text>
      </View>

      {/* Form Content */}
      <View style={styles.formContainer}>
        <Picker
          selectedValue={title}
          style={styles.picker}
          onValueChange={(itemValue) => setTitle(itemValue)}
        >
          <Picker.Item label="Chọn tiêu đề vi phạm" value="" />
          {reportTitles.map((item) => (
            <Picker.Item key={item.id} label={item.title} value={item.title} />
          ))}
        </Picker>

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Chi tiết vi phạm"
          value={content}
          onChangeText={setContent}
          multiline
        />

        <Button title="Gửi" onPress={handleSubmit} color="#007BFF" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#007BFF',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  formContainer: {
    padding: 16,
    flex: 1,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ced4da',
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderRadius: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    padding: 12,
    marginBottom: 16,
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});

export default ReportScreen;

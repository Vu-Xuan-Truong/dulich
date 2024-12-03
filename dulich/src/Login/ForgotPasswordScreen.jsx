import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Lỗi', 'Email không được để trống.');
      return;
    }

    try {
      // Truy vấn Firestore để kiểm tra email
      const userSnapshot = await firestore()
        .collection('users') // Thay đổi 'users' nếu bộ sưu tập của bạn có tên khác
        .where('email', '==', email)
        .get();

      if (userSnapshot.empty) {
        Alert.alert('Lỗi', 'Email này chưa được đăng ký!');
        return;
      }

      // Gửi yêu cầu đặt lại mật khẩu
      await auth().sendPasswordResetEmail(email);
      Alert.alert('Thành công', 'Email đặt lại mật khẩu đã được gửi!');
      navigation.navigate('Login');
    } catch (error) {
      if (error.code === 'auth/invalid-email') {
        Alert.alert('Lỗi', 'Email không hợp lệ!');
      } else {
        Alert.alert('Lỗi', 'Yêu cầu đặt lại mật khẩu thất bại! Lỗi: ' + error.message);
      }
    }
  };

  return (
    <ImageBackground 
      source={require('../config/assets/backGr.jpg')} 
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Quên mật khẩu</Text>
        
        <View style={styles.inputContainer}>
          <Icon name="envelope" size={20} color="gray" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Gửi yêu cầu đặt lại mật khẩu</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Quay lại Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Slightly transparent background
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: '100%',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
  },
  button: {
    backgroundColor: '#007BFF', // Primary color
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF', // Text color
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen;

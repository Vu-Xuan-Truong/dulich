import React, { useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { signUpUser } from '../services/SignupAuthServices'; // Import the backend logic
import { styles } from '../layput/LayoutHome/layoutSignup';

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const handleSignUp = async () => {
    if (!email.trim()) {
      Alert.alert('Lỗi', 'Email không được để trống.');
      return;
    } else if (!password.trim()) {
      Alert.alert('Lỗi', 'Mật khẩu không được để trống.');
      return;
    } else if (!confirmPassword.trim()) {
      Alert.alert('Lỗi', 'Nhập lại mật khẩu không được để trống.');
      return;
    } else if (!name.trim()) {
      Alert.alert('Lỗi', 'Họ và tên không được để trống.');
      return;
    } else if (!phone.trim()) {
      Alert.alert('Lỗi', 'Số điện thoại không được để trống.');
      return;
    }
  
    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu không khớp!');
      return;
    }
  
    const result = await signUpUser(email, password, name, phone);
  
    if (result.success) {
      Alert.alert('Thành công', 'Tài khoản đã được tạo thành công!');
      navigation.navigate('Login');
    } else {
      Alert.alert('Lỗi', result.message); // Hiển thị thông báo lỗi cụ thể
    }
  };
  

  return (
    <ImageBackground 
      source={require('../config/assets/backGr.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Đăng ký</Text>

        <View style={styles.inputContainer}>
          <Icon name="user" size={20} color="gray" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Họ và Tên"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="envelope" size={20} color="gray" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="gray" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword1}
          />
          <TouchableOpacity onPress={() => setShowPassword1(!showPassword1)} style={styles.passwordIcon}>
            <Icon name={showPassword1 ? 'eye' : 'eye-slash'} size={20} color="gray" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="gray" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Nhập lại mật khẩu"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showPassword2}
          />
          <TouchableOpacity onPress={() => setShowPassword2(!showPassword2)} style={styles.passwordIcon}>
            <Icon name={showPassword2 ? 'eye' : 'eye-slash'} size={20} color="gray" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Icon name="phone" size={20} color="gray" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Nhập số điện thoại"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Đăng ký</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.text}>Đã có tài khoản? Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default SignUpScreen;

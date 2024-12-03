import React, { useState } from 'react';
import { View, Text, TextInput, Alert, Image, TouchableOpacity, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from '../layput/LayoutHome/layoutLogin';
import { loginUser } from '../services/LoginAuthService'; // Import loginUser from authService

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (email.trim() === '' || password.trim() === '') {
      Alert.alert('Lỗi', 'Email và mật khẩu không được để trống.');
      return;
    }

    // Call loginUser from authService
    const { success, isAdmin, message } = await loginUser(email, password);

    if (success) {
      if (isAdmin) {
        navigation.navigate('Admin');
      } else {
        navigation.navigate('Home');
      }
    } else {
      Alert.alert('Lỗi', message); // Show error message
    }
  };

  return (
    <ImageBackground 
      source={require('../config/assets/backGr.jpg')} 
      style={styles.backgroundImage}
    >
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require('../config/assets/logo1.png')} />
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Đăng nhập</Text>  

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Icon name="envelope" size={20} color="gray" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#aaa"
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="gray" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.passwordIcon}>
            <Icon name={showPassword ? 'eye' : 'eye-slash'} size={20} color="gray" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Đăng nhập</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.buttonText}>Đăng ký</Text>
        </TouchableOpacity>

        <Text style={styles.divider}>----------------------</Text>

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.text}>Bạn Quên Mật Khẩu?</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default LoginScreen;

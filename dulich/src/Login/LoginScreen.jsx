import React, { useState } from 'react';
import { View, Text, TextInput, Alert, Image, TouchableOpacity, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { styles } from '../layput/LayoutHome/layoutLogin';
import { loginUser, loginWithGoogle } from '../services/LoginAuthService';


const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Cấu hình Google Sign-In
  GoogleSignin.configure({
    webClientId: '191575077165-bp7kb7ng2ltir078fhe08042qbomahdi.apps.googleusercontent.com', // Web Client ID từ Google Cloud Console
  });

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


  // async function onGoogleButtonPress() {
  //   // Check if your device supports Google Play
  //   await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  //   // Get the users ID token
  //   const signInResult = await GoogleSignin.signIn();

  //   // Try the new style of google-sign in result, from v13+ of that module
  //   idToken = signInResult.data?.idToken;


  //   // Create a Google credential with the token
  //   const googleCredential = auth.GoogleAuthProvider.credential(signInResult.data.idToken);
  //   console.log(googleCredential)
  //   navigation.navigate('NewUser')
  //   // Sign-in the user with the credential
  //   return auth().signInWithCredential(googleCredential);
  // }

  const handleGoogleLogin = async () => {
    const result = await loginWithGoogle();
    if (result.success) {
      navigation.navigate('Home');
    } else {
      Alert.alert('Lỗi', result.message);
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

        {/* Nút Đăng nhập */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Đăng nhập</Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.buttonText}>Đăng ký</Text>
        </TouchableOpacity>

        <Text style={styles.divider}>----------------------</Text>
        {/* Nút Đăng nhập với Google */}
        {/* <TouchableOpacity style={styles.button} onPress={handleGoogleLogin}>
          <Text style={styles.buttonText}>Đăng nhập với Google</Text>
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.button2} onPress={handleGoogleLogin}>
          <View style={styles.buttonContent}>
            <Image source={require('../config/assets/logoGG.png')} style={styles.googleLogo} />
            <Text style={styles.buttonText1}>Đăng nhập với Google</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.text}>         Bạn Quên Mật Khẩu?</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default LoginScreen;

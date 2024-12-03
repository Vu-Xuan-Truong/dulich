import * as React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const SettingScreen = ({ navigation }) => {
  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => {
        navigation.replace('Login'); // Chuyển hướng về trang đăng nhập sau khi đăng xuất
      })
      .catch(error => {
        alert('Đăng xuất thất bại! Lỗi: ' + error.message);
      });
  };
 
  return (
    <View style={styles.container}>

      <Text style={styles.title}>Chào mừng đến với setting Screen!</Text>
      <Button title="Đăng xuất" onPress={handleLogout} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default SettingScreen;

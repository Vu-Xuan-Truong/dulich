import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase'; // Ensure this is where you initialize Firebase auth

const SettingsScreen = ({ navigation }) => {
  
  const handleLogout = () => {
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất không?",
      [
        {
          text: "Hủy",
          style: "cancel"
        },
        {
          text: "Đăng xuất",
          onPress: async () => {
            try {
              await signOut(auth); // Use the modular signOut method
              navigation.replace('Login'); // Thay thế bằng màn hình đăng nhập hoặc trang chính
            } catch (error) {
              console.error("Error logging out: ", error);
              Alert.alert("Đã xảy ra lỗi", "Vui lòng thử lại sau.");
            }
          }
        }
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cài đặt</Text>
      <Button title="Đăng xuất" onPress={handleLogout} color="#f00" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
  },
});

export default SettingsScreen;

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ContactScreen = () => {
  const adminInfo = {
    name: 'Liên hệ',
    email: 'truong25102000@gmail.com',
    phone: '0339752895',
    // profileImageUrl: 'https://www.pinterest.com/pin/633387442646219/',
   
  };

  // Hàm mở email hoặc gọi điện thoại
  const handleLinkPress = (type) => {
    if (type === 'email') {
      Linking.openURL(`mailto:${adminInfo.email}`);
    } else if (type === 'phone') {
      Linking.openURL(`tel:${adminInfo.phone}`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Ảnh đại diện */}
      <View style={styles.profileContainer}>
        <Image source={require('../config/assets/avatar-trang-1.png')} style={styles.profileImage} />
        <Text style={styles.name}>{adminInfo.name}</Text>
      </View>
<Text>Vui lòng gửi yêu cầu qua Email hoặc hotline !! </Text>
      {/* Thông tin liên hệ */}
      <View style={styles.contactContainer}>
        <TouchableOpacity style={styles.contactRow} onPress={() => handleLinkPress('email')}>
          <Icon name="envelope" size={20} color="#3498db" style={styles.icon} />
          <Text style={styles.contactText}>{adminInfo.email}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactRow} onPress={() => handleLinkPress('phone')}>
          <Icon name="phone" size={20} color="#27ae60" style={styles.icon} />
          <Text style={styles.contactText}>{adminInfo.phone}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ContactScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  contactContainer: {
    marginTop: 20,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  icon: {
    marginRight: 10,
  },
  contactText: {
    fontSize: 16,
    color: '#333',
  },
});

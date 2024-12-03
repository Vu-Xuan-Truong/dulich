// services/authService.js

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const signUpUser = async (email, password, name, phone) => {
  try {
    // Tạo tài khoản bằng email và mật khẩu
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Lưu thông tin người dùng thêm vào Firestore
    await firestore().collection('users').doc(user.uid).set({
      name: name,
      email: email,
      phone: phone,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

    return { success: true, user };
  } catch (error) {
    // Xử lý lỗi đăng ký
    let errorMessage;
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'Email đã được sử dụng! Vui lòng chọn email khác.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Email không hợp lệ! Vui lòng nhập email hợp lệ.';
    } else {
      errorMessage = 'Đăng ký thất bại! Lỗi: ' + error.message;
    }
    return { success: false, message: errorMessage };
  }
};

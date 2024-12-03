// src/services/authService.js
import auth from '@react-native-firebase/auth';

/**
 * Sign in user with email and password.
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{ success: boolean, isAdmin: boolean, message?: string }>}
 */
export const loginUser = async (email, password) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    const isAdmin = email === 'admin@gmail.com'; // Check if the user is admin
    return { success: true, isAdmin };
  } catch (error) {
    let errorMessage = 'Tài khoản hoặc mật khẩu sai!';
    // You can handle different error codes if needed
    return { success: false, message: errorMessage };
  }
};

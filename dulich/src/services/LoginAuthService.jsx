// src/services/authService.js
// import auth from '@react-native-firebase/auth';

// /**
//  * Sign in user with email and password.
//  * @param {string} email 
//  * @param {string} password 
//  * @returns {Promise<{ success: boolean, isAdmin: boolean, message?: string }>}
//  */
// export const loginUser = async (email, password) => {
//   try {
//     const userCredential = await auth().signInWithEmailAndPassword(email, password);
//     const isAdmin = email === 'admin@gmail.com'; // Check if the user is admin
//     return { success: true, isAdmin };
//   } catch (error) {
//     let errorMessage = 'Tài khoản hoặc mật khẩu sai!';
//     // You can handle different error codes if needed
//     return { success: false, message: errorMessage };
//   }
// };
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

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
    return { success: false, message: errorMessage };
  }
};

/**
 * Sign in with Google and save the user to Firestore.
 * @returns {Promise<{ success: boolean, message?: string }>}
 */
GoogleSignin.configure({
  webClientId: '191575077165-bp7kb7ng2ltir078fhe08042qbomahdi.apps.googleusercontent.com', // Web Client ID từ Google Cloud Console
});
export const loginWithGoogle = async () => {
    // Check if device supports Google Play
  // Check if your device supports Google Play
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  // Get the users ID token
  const signInResult = await GoogleSignin.signIn();

  // Try the new style of google-sign in result, from v13+ of that module
  idToken = signInResult.data?.idToken;


  // Create a Google credential with the token
  const googleCredential = auth.GoogleAuthProvider.credential(signInResult.data.idToken);
  const userCredential = await auth().signInWithCredential(googleCredential);
  // Sign-in the user with the credential
      // Extract the user from the credential
      const user = userCredential.user;

    // Save or update user info in Firestore
    await firestore().collection('users').doc(user.uid).set({
      // uid: user.uid,
      name: user.displayName,
      email: user.email,
      profileImageUrl: user.photoURL,
      createdAt: firestore.FieldValue.serverTimestamp(),
    }, { merge: true }); // Merge prevents overwriting existing data

    return { success: true };

};

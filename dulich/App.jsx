import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, TouchableOpacity, Linking } from 'react-native';
import RootNavigator from './componemt/RootNavigator';
import { MenuProvider } from 'react-native-popup-menu';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { firebase } from '@react-native-firebase/auth';

const Stack = createNativeStackNavigator();
GoogleSignin.configure({
  webClientId: '191575077165-irsv7kl4t9ghpn4d0q4rf0ft4jcmhcam.apps.googleusercontent.com', // Web Client ID từ Google Cloud Console
  
});
const App = () => {
  useEffect(() => {
    const handleDeepLink = (event) => {
      const url = event.url;
      const postId = url.split('/').pop();
      if (postId) {
        navigation.navigate('Comments', { postId });
      }
    };

    // Sử dụng addListener để đăng ký sự kiện
    const subscription = Linking.addListener('url', handleDeepLink);

    // Hủy đăng ký sự kiện khi component bị unmount
    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <MenuProvider>
      <NavigationContainer>
        <ActionSheetProvider>
          <RootNavigator />
        </ActionSheetProvider>
      </NavigationContainer>
    </MenuProvider>
  );
};

export default App;

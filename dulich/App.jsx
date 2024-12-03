import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, TouchableOpacity, Linking } from 'react-native';
import RootNavigator from './componemt/RootNavigator';
import { MenuProvider } from 'react-native-popup-menu';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

const Stack = createNativeStackNavigator();

const App = () => {
    useEffect(() => {
        const handleDeepLink = (event) => {
          const url = event.url;
          const postId = url.split('/').pop();
          if (postId) {
            navigation.navigate('Comments', { postId });
          }
        };
    
        Linking.addEventListener('url', handleDeepLink);
    
        return () => {
          Linking.removeEventListener('url', handleDeepLink);
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
}

export default App;

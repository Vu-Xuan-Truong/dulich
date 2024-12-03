import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminScrenn from '../scr/Admin/AdminScreen';
import CategoryManagementScreen from '../scr/Admin/CategoryScreen';
import DetailPostScreen from '../scr/Admin/DetailPostScreen';
import EditUserAD from '../scr/Admin/EditUserAD';
import ManageUserScreen from '../scr/Admin/ManageUserScreen';
import TabAdminNavigator from './TabNavigator';
import LoginScreen from '../scr/LoginScreen';
import CommentsScreen from '../scr/Admin/CommentScr';
const Stack = createNativeStackNavigator();
export default RootNavigator = () => {
  return (

      <Stack.Navigator initialRouteName="Login" >
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
                
        <Stack.Screen name="Home" component={TabAdminNavigator} options={{ headerShown: false }}/>
        <Stack.Screen name="EditUserAD" component={EditUserAD} options={{ headerShown: false }}/>
        <Stack.Screen name="Comments" component={CommentsScreen} options={{ headerShown: false }}/>
      </Stack.Navigator>
      
  );
}





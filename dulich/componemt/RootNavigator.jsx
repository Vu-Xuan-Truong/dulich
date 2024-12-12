import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../src/Home/HomeScreen';
import SignUpScreen from '../src/Login/SignUpScreen';
import LoginScreen from '../src/Login/LoginScreen';
import ForgotPasswordScreen from '../src/Login/ForgotPasswordScreen';
import PasswordResetScreen from '../src/Login/PasswordResetScreen ';
import ContactScreen from '../src/Home/ContactScreen ';
import ReportScreen from '../src/Home/ReportScreen ';
import MediaViewerScreen from '../src/services/multipurpose/MediaViewerScreen';


import SettingScreen from '../src/Home/SettingScreen';
import SearchScreen from '../src/Home/SearchScreen';
import ProfileScreen from '../src/User/ProfileScreen';
import FollowingPostsScreen from '../src/Home/FollowingPostsScreen';


import AddNewScreen from '../src/Post/AddNewScreen';
import TabNavigator from './TabNavigartor';
import CommentsScreen from '../src/Post/CommetsScreen';

import EditUserScreen from '../src/User/EditUserScreen';
import UserProfileScreen from '../src/User/UserProfileScreen';
import FollowingScreen from '../src/User/FollowingScreen';
import FollowersScreen from '../src/User/FollowersScreen';
import EditPostScreen from '../src/Post/EditPostScreen';
import ChatScreen from '../src/Messenger/ChatScreem';
import ChatbotScreen from '../src/Messenger/chatbot/chatbotScr';

import SearchUsersScreen from '../src/Messenger/SearchUsersScreen';
import EditGroupChatScreen from '../src/Messenger/Groupchat/EditGroupChatScreen';
//import ListChatsScreen from '../src/Messenger/ListChatsScreen';
import ListChatsScreen1 from '../src/Messenger/ListchatsScreen';
import GroupChatScreen from '../src/Messenger/Groupchat/GroupChatScreen';
import GrMessScreen from '../src/Messenger/Groupchat/GroupMessengerScreen';



const Stack = createNativeStackNavigator();
export default RootNavigator = () => {
  return (

      <Stack.Navigator initialRouteName="Login" >
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Home" component={TabNavigator} options={{ headerShown: false }}/>
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="PasswordReset" component={PasswordResetScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Contact" component={ContactScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Report" component={ReportScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="MediaViewer" component={MediaViewerScreen} options={{ headerShown: false }}/>

        <Stack.Screen name="Setting" component={SettingScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Search" component={SearchScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="FollowingPosts" component={FollowingPostsScreen} options={{ headerShown: false }}/>

        <Stack.Screen name="AddNew" component={AddNewScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Comments" component={CommentsScreen} options={{ headerShown: false }}/>

        <Stack.Screen name="EditUser" component={EditUserScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="UserProfile" component={UserProfileScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Following" component={FollowingScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Follower" component={FollowersScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="EditPost" component={EditPostScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="ChatbotScreen" component={ChatbotScreen} options={{ headerShown: false }}/>
        {/* <Stack.Screen name="VideoCall" component={VideoCallScreen} options={{ headerShown: false }}/> */}

        <Stack.Screen name="SearchUsersScreen" component={SearchUsersScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="EditGroupChat" component={EditGroupChatScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="ListChatsScreen" component={ListChatsScreen1} options={{ headerShown: false }}/>
        <Stack.Screen name="GroupChat" component={GroupChatScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="GrMess" component={GrMessScreen} options={{ headerShown: false }}/>
        {/* <Stack.Screen name="GroupChatEdit" component={GroupChatEditScreen} options={{ headerShown: false }}/> */}

        {/* <Stack.Screen name="Admin" component={TabAdminNavigator} options={{ headerShown: false }}/>
        <Stack.Screen name="EditUserAD" component={EditUserAD} options={{ headerShown: false }}/>
       
        <Stack.Screen name="NewPW" component={AdminChangePasswordScreen} options={{ headerShown: false }}/> */}
      </Stack.Navigator>
      
  );
}





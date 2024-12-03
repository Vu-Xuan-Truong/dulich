import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

import DetailPostScreen from '../src/Admin/DetailPostScreen';
import DetailUserScreen from '../src/Admin/DetailUserScreen';
import AdminScreen from '../src/Admin/AdminScrenn';
import ManageUserScreen from '../src/Admin/ManageUserScreen';
import SettingsScreen from '../src/Admin/SettingsScreen';
import CategoryManagementScreen from '../src/Admin/CategoryScreen';
import AdminChangePasswordScreen from '../src/Admin/hehe';
const Tab = createBottomTabNavigator();

const TabAdminNavigator = () => {
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: '#888',
        tabBarBadgeStyle: {
          backgroundColor: '#ff3b30',
          color: 'white',
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={AdminScreen}
        options={{
          tabBarLabel: "Quản lý bài viết",
          tabBarIcon: ({ color, size }) => <Icon name='book' color={color} size={size} />,
        }}
      />
    <Tab.Screen
        name="Quản lý người dùng"
        component={ManageUserScreen}
        options={{
          tabBarLabel: "Quản lý người dùng",
          tabBarIcon: ({ color, size }) => <Icon name='user' color={color} size={size} />,
         
        }}
      />
      <Tab.Screen
        name="setting"
        component={SettingsScreen}
        options={{
          tabBarLabel: "Cài đặt",
          tabBarIcon: ({ color, size }) => <Icon name='inbox' color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="AddNew"
        component={CategoryManagementScreen}
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ color, size }) => (
            <View style={styles.addButton}>
              <Icon name='plus' color={color} size={size} />
            </View>
          ),
        }}
      />

      {/* <Tab.Screen
        name="Setting"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Hồ sơ",
          tabBarIcon: ({ color, size }) => <Icon name='user' color={color} size={size} />,
        }}
      /> */}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
});

export default TabAdminNavigator;

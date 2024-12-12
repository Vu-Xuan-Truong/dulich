import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

import HomeScreen from '../src/Home/HomeScreen';
import AddNewScreen from '../src/Post/AddNewScreen';
import NotificationScreen from '../src/Home/NotificationScreen';
import ProfileScreen from '../src/User/ProfileScreen';

import ListChatsScreen from '../src/Messenger/ListchatsScreen';

import SearchUsersScreen from '../src/Messenger/SearchUsersScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const [hasNewNotifications, setHasNewNotifications] = React.useState(false);

  const checkForNewNotifications = () => {
    setHasNewNotifications(true);
  };

  React.useEffect(() => {
    checkForNewNotifications();
  }, []);

  const markNotificationsAsRead = () => {
    setHasNewNotifications(false);
  };

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
        component={HomeScreen}
        options={{
          tabBarLabel: "Trang chủ",
          tabBarIcon: ({ color, size }) => <Icon name='home' color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ListChatsScreen}
        options={{
          tabBarLabel: "Hộp thư",
          tabBarIcon: ({ color, size }) => <Icon name='wechat' color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="AddNew"
        component={AddNewScreen}
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ color, size }) => (
            <View style={styles.addButton}>
              <Icon name='plus' color={color} size={size} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Notification"
        component={NotificationScreen}
        options={{
          tabBarLabel: "Hoạt động",
          tabBarIcon: ({ color, size }) => <Icon name='bell' color={color} size={size} />,
          tabBarBadge: hasNewNotifications ? '•' : undefined,
        }}
        listeners={{
          tabPress: () => {
            markNotificationsAsRead();
          },
        }}
      />
      <Tab.Screen
        name="Setting"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Hồ sơ",
          tabBarIcon: ({ color, size }) => <Icon name='user' color={color} size={size} />,
        }}
      />
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

export default TabNavigator;

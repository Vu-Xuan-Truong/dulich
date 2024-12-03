
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import RootNavigator from './compoment/RootNavigator';

const Stack = createStackNavigator();

export default function Admin() {
  return (
    <NavigationContainer>
  <RootNavigator/>
    </NavigationContainer>
  );
}

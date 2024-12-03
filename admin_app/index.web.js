import { AppRegistry } from 'react-native';
import App from './App'; // Đường dẫn tới file App của bạn
import { name as appName } from './app.json';
import { render } from 'react-dom';

AppRegistry.registerComponent(appName, () => App);

const rootTag = document.getElementById('root') || document.createElement('div');
AppRegistry.runApplication(appName, {
  initialProps: {},
  rootTag,
});

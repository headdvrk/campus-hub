import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';

import App from './App';

// alt.edu.kz басқа сайттан Referer-мен келген сурет сұранысына 403 қайтарады (hotlink қорғанысы);
// браузерде Referer жібермейміз. Телефонда Referer жіберілмейді, сондықтан тек web үшін
if (Platform.OS === 'web') {
  const meta = document.createElement('meta');
  meta.name = 'referrer';
  meta.content = 'no-referrer';
  document.head.appendChild(meta);
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

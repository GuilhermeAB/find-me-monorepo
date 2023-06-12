/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import { createApp } from 'vue';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import App from './App.vue';
import './assets/css/global.scss';

// Composables

// Plugins
import { registerPlugins } from './plugins';

const firebaseConfig = {
  apiKey: 'AIzaSyB8MQNneW18-EHUsXknCCC2jxyYOAMAVak',
  authDomain: 'find-me-project-941c5.firebaseapp.com',
  projectId: 'find-me-project-941c5',
  storageBucket: 'find-me-project-941c5.appspot.com',
  messagingSenderId: '165036472393',
  appId: '1:165036472393:web:f70fef580b2261eafa6798',
  measurementId: 'G-037XP1YNV0',
};

const app = createApp(App);

registerPlugins(app);

const firebaseApp = initializeApp(firebaseConfig);
getAnalytics(firebaseApp);

app.mount('#app');

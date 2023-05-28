/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import { createApp } from 'vue';
import App from './App.vue';
import './assets/css/global.scss';

// Composables

// Plugins
import { registerPlugins } from './plugins';

const app = createApp(App);

registerPlugins(app);

app.mount('#app');

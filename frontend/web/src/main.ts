/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import { createApp } from 'vue';
import { createHead } from 'unhead';
import App from './App.vue';
import './assets/css/global.scss';

// Plugins
import { registerPlugins } from './plugins';

const app = createApp(App);

registerPlugins(app);
createHead();

app.mount('#app');

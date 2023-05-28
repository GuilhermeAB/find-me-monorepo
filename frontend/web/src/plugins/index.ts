/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import type { App } from 'vue';
import { loadFonts } from './webfontloader';
import vuetify from './vuetify';
import pinia from '../store';
import router from '../router';
import { i18n } from './i18n';

export function registerPlugins(app: App): void {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  loadFonts();
  app
    .use(vuetify)
    .use(i18n)
    .use(router)
    .use(pinia);
}

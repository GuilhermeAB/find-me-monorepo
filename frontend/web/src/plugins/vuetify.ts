/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

// Composables
import { createVuetify } from 'vuetify';
import { VDataTable } from 'vuetify/labs/VDataTable';

import { en, pt } from 'vuetify/locale';

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components: {
    VDataTable,
  },
  theme: {
    defaultTheme: 'light',
    // defaultTheme: 'dark',
    themes: {
      light: {
        colors: {
          primary: '#3fbf54',
          secondary: '#72db83',
        },
      },
      dark: {
        colors: {
          primary: '#3fbf54',
          secondary: '#72db83',
        },
      },
    },
  },
  locale: {
    locale: 'en',
    fallback: 'en',
    messages: {
      en,
      pt,
    },
  },
});

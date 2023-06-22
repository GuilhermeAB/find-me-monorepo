<template>
  <v-app>
    <v-main>
      <AppBar />
      <Notification />
      <RouterView />
      <Health />

      <v-snackbar
        v-model='snackbar'
        :timeout='-1'
        color='error'
      >
        {{ $t('BetaWarningText') }}

        <template #actions>
          <v-btn
            variant='text'
            @click='snackbar = false'
          >
            {{ $t('Close') }}
          </v-btn>
        </template>
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
  import 'leaflet/dist/leaflet.css';
  import { RouterView } from 'vue-router';
  import { provide, ref } from 'vue';
  import AppBar from './components/app-bar/AppBar.vue';
  import Notification from './components/notification/Notification.vue';
  import Health from './components/health/Health.vue';
  import { i18n } from './plugins/i18n';
  import './standard/request-interceptors';

  provide('$i18n', i18n.global);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const $t = i18n!.global.t;

  const snackbar = ref(true);
</script>

<template>
  <v-app>
    <v-main>
      <AppBar />
      <Notification />
      <RouterView />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
  import 'leaflet/dist/leaflet.css';
  import { RouterView } from 'vue-router';
  import { provide } from 'vue';
  import AppBar from './components/app-bar/AppBar.vue';
  import Notification from './components/notification/Notification.vue';
  import { i18n } from './plugins/i18n';
  import './standard/request-interceptors';

  provide('$i18n', i18n.global);
</script>

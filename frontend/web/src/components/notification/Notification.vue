<template>
  <v-list
    density='compact'
    width='300px'
    class='notification-list'
    style='background: transparent;'
  >
    <v-list-item
      v-for='item in notification.list'
      :key='item.id'
      class='pt-1 pb-0 pa-2'
    >
      <NotificationAlert
        :id='item.id'
        :code='item.code'
        :message='item.message'
        :type='item.type'
        :params='item.params'
      />
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
  import NotificationAlert from './NotificationAlert.vue';
  import { useNotificationStore } from '../../store/notification';

  const notification = useNotificationStore();
</script>

<style scoped>
  .notification-list {
    position: fixed !important;
    bottom: 0 !important;
    left: 0 !important;
    z-index: 999999 !important;
  }
</style>

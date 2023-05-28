<template>
  <v-hover :model-value='hover'>
    <template #default>
      <v-alert
        closable
        :type='type'
        :text='te(code) || !message ? $t(code, params) : message'
        density='compact'
        class='notification-alert'
        @click:close='notification.remove(id)'
        @mouseover='showHover'
        @mouseleave='hideHover'
      />
      <v-progress-linear
        color='#bbb'
        :model-value='progress'
      />
    </template>
  </v-hover>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useNotificationStore } from '../../store/notification';

  const props = defineProps({
    id: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      default: undefined,
    },
    code: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    params: {
      type: Object,
      default: undefined,
    },
  });

  const { te } = useI18n();
  const notification = useNotificationStore();

  const hover = ref(false);
  const progress = ref(100);
  watch(progress, (value) => {
    if (value <= 0) {
      notification.remove(props.id);
    }
  });

  function startTimer (): NodeJS.Timer {
    const interval = setInterval(() => {
      progress.value -= 3;

      if (progress.value <= 0) {
        clearInterval(interval);
      }
    }, 100);

    return interval;
  }

  let interval = startTimer();

  function stopTimer (): void {
    progress.value = 100;
    clearInterval(interval);
  }

  function showHover (): void {
    stopTimer();
    hover.value = true;
  }

  function hideHover (): void {
    hover.value = false;
    interval = startTimer();
  }
</script>

<style scoped>
  .notification-alert {
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }
</style>

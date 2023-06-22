<template>
  <v-container class='px-2 pt-2'>
    <v-row no-gutters>
      <span class='text-h6'>
        {{ $t('MyAlerts') }}

        <span v-if='alertList' class='text-body-2'>
          ({{ alertList.length }})
        </span>
      </span>
      <v-divider class='mt-1 mb-2' />
    </v-row>

    <v-row no-gutters>
      <v-row v-if='alertList && alertList.length' no-gutters>
        <v-col
          v-for='item in alertList'
          :key='item.id'
          class='pa-0 pb-2 px-1'
          cols='12'
          sm='6'
          md='6'
          lg='3'
          xl='3'
          xxl='3'
        >
          <AlertListItem :item='item' :image-height='imageHeight' />
        </v-col>
      </v-row>

      <v-col
        v-else
        cols='12'
        sm='12'
        md='12'
        lg='12'
        xl='12'
        xxl='12'
        class='px-1 py-1'
      >
        <v-sheet
          class='d-flex align-center justify-center flex-wrap text-center mx-auto'
          rounded
          width='100%'
          min-width='100'
          min-height='100'
        >
          <div>
            <p class='text-body-2'>
              <v-icon class='mr-3'>
                mdi-message-alert-outline
              </v-icon>

              {{ $t('NoAlertsFound') }}
            </p>
          </div>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang='ts'>
  import {
    inject, ref, onMounted, computed,
  } from 'vue';
  import { Composer } from 'vue-i18n';
  import { useDisplay } from 'vuetify';
  import AlertListItem from '../../dashboard/components/alert/AlertListItem.vue';
  import { Alert, AlertService } from '@/services';

  const $i18n = inject<Composer>('$i18n');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const $t = $i18n!.t;
  const {
    xl, lg, md,
  } = useDisplay();

  const imageHeight = computed(() => {
    if (xl.value) {
      return '10rem';
    }
    if (lg.value) {
      return '13rem';
    }
    if (md.value) {
      return '14rem';
    }
    return '18rem';
  });

  const alertList = ref<Alert[] | undefined>();
  onMounted(async () => {
    alertList.value = await AlertService.listByUser();
  });
</script>

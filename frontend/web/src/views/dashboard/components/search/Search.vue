<template>
  <v-row no-gutters>
    <span class='text-h5 mt-3'>
      {{ $t('Alerts') }}
    </span>

    <v-spacer />

    <v-btn-toggle
      v-model='type'
      multiple
      mandatory
      density='comfortable'
      color='primary'
      class='ml-2'
    >
      <v-btn :value='AlertType.Person'>
        <v-icon>mdi-account</v-icon>
      </v-btn>

      <v-btn :value='AlertType.Pet'>
        <v-icon>mdi-paw</v-icon>
      </v-btn>
    </v-btn-toggle>
  </v-row>
  <v-divider class='mt-1 mb-2' />
</template>

<script setup lang='ts'>
  import { ref, watch } from 'vue';
  import { debounce } from 'lodash';
  import { AlertType } from '@/services';
  import { useAlertStore } from '../../../../store/alert';

  const alert = useAlertStore();

  const type = ref([AlertType.Person, AlertType.Pet]);
  watch(type, debounce(() => {
    if (type.value.length === 2) {
      alert.updateList();
    } else {
      alert.updateList(type.value[0]);
    }
  }, 900));
</script>

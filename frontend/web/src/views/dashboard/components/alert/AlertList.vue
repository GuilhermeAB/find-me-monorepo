<template>
  <v-row no-gutters>
    <v-col
      cols='12'
      sm='6'
      md='6'
      lg='4'
      xl='4'
      xxl='3'
      class='pa-0 pb-2 px-1'
    >
      <v-card
        color='primary'
        variant='outlined'
        width='100%'
        min-width='100'
        height='100%'
        min-height='100'
        style='border-style: dashed;'
        @click='newAlert'
      >
        <v-sheet
          class='d-flex align-center justify-center flex-wrap text-center mx-auto'
          rounded
          width='100%'
          height='100%'
        >
          <div>
            <v-icon color='primary' class='mb-3'>
              mdi-plus
            </v-icon>

            <p class='text-body-1 text-primary'>
              {{ $t('NewAlert') }}
            </p>
          </div>
        </v-sheet>
      </v-card>
    </v-col>

    <v-col
      v-for='item in alert.list'
      :key='item.id'
      cols='12'
      sm='6'
      md='6'
      lg='4'
      xl='4'
      xxl='3'
      class='pa-0 pb-2 px-1'
    >
      <AlertListItem :item='item' />
    </v-col>

    <v-col
      v-if='!alert.list || !alert.list.length'
      cols='12'
      sm='6'
      md='6'
      lg='8'
      xl='8'
      xxl='9'
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

            {{ $t('EmptyAlertListLabel') }}
          </p>
        </div>
      </v-sheet>
    </v-col>
  </v-row>

  <v-dialog
    v-model='newAlertDialog'
    fullscreen
    persistent
    :scrim='false'
    transition='dialog-bottom-transition'
  >
    <v-card>
      <v-toolbar
        color='primary'
      >
        <v-btn
          icon
          @click='newAlertDialog = false'
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ $t('NewAlert') }}</v-toolbar-title>
      </v-toolbar>

      <v-container fluid>
        <v-row class='align-center justify-center'>
          <v-col
            cols='12'
            sm='12'
            md='8'
            lg='6'
            xl='6'
            xxl='6'
          >
            <AlertCreate @close='newAlertDialog = false' />
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import AlertListItem from './AlertListItem.vue';
  import AlertCreate from './AlertCreate.vue';
  import { useAlertStore } from '../../../../store/alert';

  const alert = useAlertStore();

  const newAlertDialog = ref(false);

  function newAlert (): void {
    newAlertDialog.value = true;
  }
</script>

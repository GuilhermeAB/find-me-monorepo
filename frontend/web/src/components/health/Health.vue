<template>
  <v-dialog
    v-model='modal'
    width='40%'
    min-width='300'
  >
    <v-card>
      <v-card-title>
        {{ $t('ServicesStatusTitle') }}
      </v-card-title>

      <v-card-text>
        <v-list lines='one'>
          <v-list-item
            :title='$t("AuthAPI")'
            :subtitle='auth ? $t("Online") : $t("Offline")'
          >
            <template #prepend>
              <v-icon :color='auth ? "success" : "error"'>
                {{ auth ? "mdi-check" : "mdi-alert" }}
              </v-icon>
            </template>
          </v-list-item>

          <v-list-item
            :title='$t("AlertAPI")'
            :subtitle='alert ? $t("Online") : $t("Offline")'
          >
            <template #prepend>
              <v-icon :color='alert ? "success" : "error"'>
                {{ alert ? "mdi-check" : "mdi-alert" }}
              </v-icon>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>

      <v-card-actions>
        <v-btn block variant='outlined' color='primary' :loading='isLoading' @click='checkAPIs'>
          {{ $t('CheckAgain') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang='ts'>
  import { onMounted, ref, inject } from 'vue';
  import { Composer } from 'vue-i18n';
  import { AuthenticationService, AlertService } from '../../services';

  const $i18n = inject<Composer>('$i18n');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const $t = $i18n!.t;

  const modal = ref(false);
  const isLoading = ref(false);
  const auth = ref(true);
  const alert = ref(true);

  async function checkAuthAPI (): Promise<void> {
    try {
      await AuthenticationService.health();
      auth.value = true;
    } catch (e) {
      auth.value = false;
    }
  }
  async function checkAlertAPI (): Promise<void> {
    try {
      await AlertService.health();
      alert.value = true;
    } catch (e) {
      alert.value = false;
    }
  }

  async function checkAPIs (): Promise<void> {
    isLoading.value = true;
    await checkAuthAPI();
    await checkAlertAPI();
    isLoading.value = false;

    modal.value = !alert.value || !auth.value;
  }

  onMounted(async () => {
    await checkAPIs();
  });
</script>

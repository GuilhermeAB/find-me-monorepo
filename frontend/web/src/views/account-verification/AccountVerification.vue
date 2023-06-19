<template>
  <v-container fluid class='fill-height'>
    <v-row align='center' justify='center'>
      <v-col
        cols='12'
        sm='12'
        md='8'
        lg='8'
        xl='8'
        xxl='8'
      >
        <v-row align='center' justify='center'>
          <v-card width='60%'>
            <v-card-title>
              {{ $t('ActivateAccount') }}
            </v-card-title>

            <v-card-text class='mt-3'>
              <v-text-field
                v-model='activationCode'
                hide-details
                variant='outlined'
                class='mb-3'
                :label='$t("Code")'
              />
            </v-card-text>

            <v-card-actions>
              <v-container>
                <v-row>
                  <v-btn
                    block
                    variant='flat'
                    color='primary'
                    :loading='isLoading'
                    @click='send'
                  >
                    {{ $t('Send') }}
                  </v-btn>
                </v-row>

                <v-row class='mt-5'>
                  <v-btn
                    block
                    variant='outlined'
                    color='primary'
                    :loading='isLoading'
                    @click='requestNewCode'
                  >
                    {{ $t('RequestNewCode') }}
                  </v-btn>
                </v-row>
              </v-container>
            </v-card-actions>
          </v-card>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang='ts'>
  import {
    ref,
    inject,
    onMounted,
  } from 'vue';
  import { Composer } from 'vue-i18n';
  import { useRoute, useRouter } from 'vue-router';
  import { AuthenticationService } from '@/services';

  const $i18n = inject<Composer>('$i18n');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const $t = $i18n!.t;

  const isLoading = ref(false);
  const activationCode = ref();

  const router = useRouter();
  const route = useRoute();

  async function send (): Promise<void> {
    try {
      isLoading.value = true;
      await AuthenticationService.activateAccount(activationCode.value);
      await AuthenticationService.signOut();

      await router.replace({ name: 'SignIn' });
    } finally {
      isLoading.value = false;
    }
  }

  onMounted(() => {
    const code = route.params.code as string | undefined;

    if (code) {
      activationCode.value = code;
      send();
    }
  });

  async function requestNewCode (): Promise<void> {
    try {
      isLoading.value = true;
      await AuthenticationService.activateAccountRequest();
    } finally {
      isLoading.value = false;
    }
  }
</script>

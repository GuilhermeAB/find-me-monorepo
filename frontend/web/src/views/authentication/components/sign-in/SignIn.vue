<template>
  <v-card variant='flat' width='60%' color='transparent'>
    <v-card-title>
      {{ $t('SignIn') }}
    </v-card-title>

    <v-card-text>
      <v-form ref='form' validate-on='blur'>
        <v-text-field
          v-model='email'
          hide-details
          variant='outlined'
          class='mb-3'
          :label='$t("Email")'
          :rules='[rules.required]'
        />

        <v-text-field
          v-model='password'
          hide-details
          variant='outlined'
          class='mb-2'
          :label='$t("Password")'
          :rules='[rules.required]'
        />

        <v-row no-gutters align='center' class='pa-0 ma-0 mt-1 mb-3'>
          <v-checkbox
            v-model='rememberMe'
            hide-details
            color='primary'
            density='compact'
            :label='$t("RememberMe")'
          />
        </v-row>

        <v-btn
          block
          color='primary'
          :loading='loading'
          @click='signIn'
        >
          {{ $t('SignIn') }}
        </v-btn>

        <v-divider class='mt-6 mb-6' />

        <v-btn block color='primary' variant='outlined' class='mb-3'>
          {{ $t('SignUp') }}
        </v-btn>

        <v-btn
          block
          variant='text'
          color='primary'
        >
          {{ $t('ForgotPassword') }}
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang='ts'>
  import {
    ref, inject,
  } from 'vue';
  import { Composer } from 'vue-i18n';
  import { useRouter } from 'vue-router';
  import { useAuthenticationStore } from '../../../../store/authentication';

  const $i18n = inject<Composer>('$i18n');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const $t = $i18n!.t;
  const router = useRouter();

  const rules = {
    required: (value: unknown): boolean | string => !!value || $t('ValueRequired'),
    descriptionLength: (value: string): boolean | string => value.length <= 400 || $t('DescriptionLength'),
  };

  const form = ref();
  const email = ref<string>('');
  const password = ref<string>('');
  const rememberMe = ref(false);
  const loading = ref(false);

  const authentication = useAuthenticationStore();

  async function signIn (): Promise<void> {
    const { valid } = await form.value.validate();

    if (valid) {
      try {
        loading.value = true;

        await authentication.signIn(email.value, password.value, rememberMe.value);

        router.replace({ name: 'Home' });
      } finally {
        loading.value = false;
      }
    }
  }
</script>

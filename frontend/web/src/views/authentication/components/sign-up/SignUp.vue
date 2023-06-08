<template>
  <v-card variant='flat' width='80%' color='transparent'>
    <v-card-title>
      {{ $t('SignUp') }}
    </v-card-title>

    <v-card-text>
      <v-form ref='form' validate-on='blur'>
        <v-text-field
          v-model='name'
          hide-details
          variant='outlined'
          class='mb-3'
          :label='$t("Name")'
          :rules='[rules.required]'
        />

        <v-text-field
          v-model='birthDate'
          hide-details
          variant='outlined'
          class='mb-3'
          :label='$t("BirthDate")'
          :rules='[rules.required]'
        />

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
          class='mb-3'
          type='password'
          :label='$t("Password")'
          :rules='[rules.required]'
        />

        <v-btn
          block
          color='primary'
          :loading='loading'
          @click='signUp'
        >
          {{ $t('SignUp') }}
        </v-btn>

        <v-divider class='mt-6 mb-6' />

        <v-btn
          block
          color='primary'
          variant='outlined'
          class='mb-3'
          @click='signIn'
        >
          {{ $t('SignIn') }}
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
  import { AuthenticationService } from '@/services/authentication';

  const emit = defineEmits(['sign-in']);

  const $i18n = inject<Composer>('$i18n');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const $t = $i18n!.t;

  const rules = {
    required: (value: unknown): boolean | string => !!value || $t('ValueRequired'),
    descriptionLength: (value: string): boolean | string => value.length <= 400 || $t('DescriptionLength'),
  };

  const form = ref();
  const name = ref<string>('');
  const birthDate = ref<string>('');
  const email = ref<string>('');
  const password = ref<string>('');
  const loading = ref(false);

  async function signUp (): Promise<void> {
    const { valid } = await form.value.validate();

    if (valid) {
      try {
        loading.value = true;

        await AuthenticationService.signUp(
          email.value,
          password.value,
          name.value,
          birthDate.value,
        );

        emit('sign-in');
      } finally {
        loading.value = false;
      }
    }
  }

  function signIn (): void {
    emit('sign-in');
  }
</script>

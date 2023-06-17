<template>
  <v-tabs
    v-model='tab'
    grow
  >
    <v-tab value='one'>
      {{ $t('EditData') }}
    </v-tab>
    <v-tab value='two'>
      {{ $t('EditPassword') }}
    </v-tab>
  </v-tabs>

  <v-card-text>
    <v-window v-model='tab'>
      <v-window-item value='one'>
        <v-form ref='formData' validate-on='blur' class='mt-3'>
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
            v-maska:[dateMask]
            hide-details
            variant='outlined'
            class='mb-2'
            :label='$t("BirthDate")'
            placeholder='dd/MM/yyyy'
            :rules='[rules.required]'
          />

          <v-btn
            block
            color='primary'
            class='mt-3'
            :loading='loading'
            @click='saveData'
          >
            {{ $t('Save') }}
          </v-btn>
        </v-form>
      </v-window-item>

      <v-window-item value='two'>
        <v-form ref='formPassword' validate-on='blur' class='mt-3'>
          <v-text-field
            v-model='currentPassword'
            hide-details
            variant='outlined'
            class='mb-3'
            type='password'
            :label='$t("CurrentPassword")'
            :rules='[rules.required]'
          />

          <v-text-field
            v-model='password'
            hide-details
            variant='outlined'
            class='mb-3'
            type='password'
            :label='$t("NewPassword")'
            :rules='[rules.required]'
          />

          <v-text-field
            v-model='repeatPassword'
            hide-details
            variant='outlined'
            class='mb-2'
            type='password'
            :label='$t("RepeatPassword")'
            :rules='[rules.required]'
          />

          <v-btn
            block
            color='primary'
            class='mt-3'
            :loading='loading'
            @click='savePassword'
          >
            {{ $t('Save') }}
          </v-btn>
        </v-form>
      </v-window-item>
    </v-window>
  </v-card-text>
</template>

<script setup lang='ts'>
  import { ref, inject, onMounted } from 'vue';
  import { Composer } from 'vue-i18n';
  import { useAuthenticationStore } from '@/store/authentication';
  import { AuthenticationService } from '@/services';
  import { vMaska } from 'maska';

  const emit = defineEmits(['updated']);

  const $i18n = inject<Composer>('$i18n');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const $t = $i18n!.t;

  const authentication = useAuthenticationStore();
  const account = authentication.currentUser;
  const dateMask = { mask: '##/##/####' };

  const tab = ref('one');
  const rules = {
    required: (value: unknown): boolean | string => !!value || $t('ValueRequired'),
  };

  const formData = ref();
  const formPassword = ref();

  const name = ref<string>('');
  const birthDate = ref<string>('');

  const currentPassword = ref<string>('');
  const password = ref<string>('');
  const repeatPassword = ref<string>('');
  const loading = ref(false);

  onMounted(() => {
    if (account) {
      const birthDateProp = account.person.birthDate.toString().substring(0, 10);
      const [birthYear, birthMonth, birthDay] = birthDateProp.split('-');

      name.value = account.person.name;
      birthDate.value = `${birthDay}/${birthMonth}/${birthYear}`;
    }
  });

  async function saveData (): Promise<void> {
    const { valid } = await formData.value.validate();

    if (valid) {
      try {
        loading.value = true;

        await AuthenticationService.updatePerson(name.value, birthDate.value);
        emit('updated');
      } finally {
        loading.value = false;
      }
    }
  }

  async function savePassword (): Promise<void> {
    const { valid } = await formPassword.value.validate();

    if (valid) {
      try {
        loading.value = true;

        await AuthenticationService.updatePassword(currentPassword.value, password.value, repeatPassword.value);
        emit('updated');
      } finally {
        loading.value = false;
      }
    }
  }
</script>

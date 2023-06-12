<template>
  <v-btn
    v-if='!authentication.currentUser'
    variant='flat'
    color='primary'
    @click='goToSignIn'
  >
    {{ $t('SignIn') }}
  </v-btn>

  <v-btn
    v-else
    icon
    variant='flat'
    color='primary'
  >
    <v-icon size='large'>
      mdi-account
    </v-icon>
  </v-btn>
</template>

<script setup lang='ts'>
  import { useRouter } from 'vue-router';
  import { onMounted, inject } from 'vue';
  import { Composer } from 'vue-i18n';
  import { useAuthenticationStore } from '@/store/authentication';

  const $i18n = inject<Composer>('$i18n');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const $t = $i18n!.t;

  const router = useRouter();
  const authentication = useAuthenticationStore();

  onMounted(async () => {
    await authentication.loggedUser();
  });

  function goToSignIn (): void {
    router.push({ name: 'SignIn' });
  }
</script>

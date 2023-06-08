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
  import { onMounted } from 'vue';
  import { useAuthenticationStore } from '@/store/authentication';

  const router = useRouter();
  const authentication = useAuthenticationStore();

  onMounted(async () => {
    await authentication.loggedUser();
  });

  function goToSignIn (): void {
    router.push({ name: 'SignIn' });
  }
</script>

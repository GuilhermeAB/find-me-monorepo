<template>
  <v-btn
    v-if='!user'
    variant='flat'
    color='primary'
    @click='goToSignIn'
  >
    {{ $t('SignIn') }}
  </v-btn>

  <v-menu v-else location='bottom'>
    <template #activator='{ props }'>
      <v-btn
        icon
        variant='flat'
        color='primary'
        v-bind='props'
      >
        <v-icon>
          mdi-account
        </v-icon>
      </v-btn>
    </template>

    <v-list class='pa-0'>
      <v-list-item @click='goToProfile'>
        {{ $t('Profile') }}
      </v-list-item>

      <v-list-item @click='signOut'>
        {{ $t('SignOut') }}
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang='ts'>
  import { useRouter } from 'vue-router';
  import { onMounted, inject, ref } from 'vue';
  import { Composer } from 'vue-i18n';
  import { useAuthenticationStore } from '@/store/authentication';
  import { AuthenticationService } from '@/services';

  const $i18n = inject<Composer>('$i18n');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const $t = $i18n!.t;

  const router = useRouter();
  const authentication = useAuthenticationStore();

  const user = ref<unknown>(undefined);
  onMounted(async () => {
    await authentication.loggedUser();
    user.value = authentication.currentUser;
  });

  function goToSignIn (): void {
    router.push({ name: 'SignIn' });
  }

  function goToProfile (): void {
    router.push({ name: 'Profile' });
  }

  async function signOut (): Promise<void> {
    await AuthenticationService.signOut();
    await authentication.loggedUser();
    user.value = authentication.currentUser;
    router.push({ name: 'Home' });
  }
</script>

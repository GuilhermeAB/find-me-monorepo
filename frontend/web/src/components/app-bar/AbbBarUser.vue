<template>
  <v-btn
    v-if='!user'
    variant='flat'
    color='primary'
    @click='goToSignIn'
  >
    {{ $t('SignIn') }}
  </v-btn>

  <v-menu
    v-else
    v-model='menu'
    location='bottom'
    :close-on-content-click='false'
  >
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

    <v-card min-width='200'>
      <v-card-title class='text-body-2 pb-0'>
        {{ user.person.name }}
      </v-card-title>

      <v-card-subtitle class='text-caption mt-n2'>
        {{ user.email }}
      </v-card-subtitle>

      <v-divider class='mt-3' />

      <v-list class='pa-0'>
        <v-list-item @click='goToProfile'>
          {{ $t('Profile') }}
        </v-list-item>

        <v-list-item @click='signOut'>
          {{ $t('SignOut') }}
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script setup lang='ts'>
  import { useRouter } from 'vue-router';
  import { onMounted, inject, ref } from 'vue';
  import { Composer } from 'vue-i18n';
  import { useAuthenticationStore } from '@/store/authentication';
  import { AuthenticationService, User } from '@/services';

  const $i18n = inject<Composer>('$i18n');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const $t = $i18n!.t;

  const router = useRouter();
  const authentication = useAuthenticationStore();

  const menu = ref(false);
  const user = ref<User | undefined>(undefined);
  onMounted(async () => {
    await authentication.loggedUser();
    user.value = authentication.currentUser;
  });

  function goToSignIn (): void {
    router.push({ name: 'SignIn' });
  }

  function goToProfile (): void {
    menu.value = false;
    router.push({ name: 'Profile' });
  }

  async function signOut (): Promise<void> {
    menu.value = false;
    await AuthenticationService.signOut();
    await authentication.loggedUser();
    user.value = authentication.currentUser;
    router.push({ name: 'Home' });
  }
</script>

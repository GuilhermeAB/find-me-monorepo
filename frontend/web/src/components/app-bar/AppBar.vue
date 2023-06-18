<template>
  <v-app-bar v-if='isVisible' elevation='0' extension-height='1'>
    <!-- <v-app-bar-nav-icon /> -->
    <v-app-bar-title>
      <v-tooltip location='bottom'>
        <template #activator='{ props }'>
          <v-btn
            variant='plain'
            style='opacity: 1'
            v-bind='props'
            @click='goToHome'
          >
            <v-icon size='large' color='primary'>
              mdi-crosshairs
            </v-icon>

            <span class='text-h5 font-weight-bold ml-2'>
              <span class='text-primary'>F</span>ind me
            </span>
          </v-btn>
        </template>

        <span>
          {{ $t('HomePage') }}
        </span>
      </v-tooltip>
    </v-app-bar-title>

    <template #append>
      <Theme />
      <Language />

      <AppBarUser />
    </template>

    <template #extension>
      <v-divider :thickness='3' color='primary' style='opacity: 0.7' />
    </template>
  </v-app-bar>

  <v-banner
    v-if='isVisible && authentication.currentUser && [UserStatus.unverified, UserStatus.disabled].includes(authentication.currentUser.status)'
    color='warning'
    density='compact'
    lines='one'
  >
    <template #text>
      <v-container fluid>
        <v-row>
          <v-icon color='warning' class='mr-3'>
            mdi-alert
          </v-icon>

          {{ $t('ActivateAccountBanner', { status: $t(authentication.currentUser.status).toLowerCase() }) }}
        </v-row>
      </v-container>
    </template>

    <template v-if='authentication.currentUser.status === UserStatus.unverified' #actions>
      <v-container>
        <v-row>
          <v-btn variant='flat' @click='goToActivation'>
            {{ $t('ActivateAccount') }}
          </v-btn>
        </v-row>
      </v-container>
    </template>
  </v-banner>
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router';
  import { ref, watch, inject } from 'vue';
  import { Composer } from 'vue-i18n';
  import Language from '../language/Language.vue';
  import Theme from '../theme/Theme.vue';
  import AppBarUser from './AbbBarUser.vue';
  import { useAuthenticationStore } from '@/store/authentication';
  import { UserStatus } from '@/services';

  const $i18n = inject<Composer>('$i18n');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const $t = $i18n!.t;

  const router = useRouter();
  const authentication = useAuthenticationStore();

  const isVisible = ref(router.currentRoute.value.name !== 'SignIn');
  watch(router.currentRoute, () => {
    isVisible.value = router.currentRoute.value.name !== 'SignIn';
  });

  function goToHome (): void {
    router.push({ name: 'Home' });
  }

  function goToActivation (): void {
    router.push({ name: 'Verification' });
  }
</script>

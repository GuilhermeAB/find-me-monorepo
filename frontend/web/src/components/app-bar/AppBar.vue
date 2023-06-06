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

      <v-btn
        variant='flat'
        color='primary'
        @click='goToSignIn'
      >
        {{ $t('SignIn') }}
      </v-btn>
    </template>

    <template #extension>
      <v-divider :thickness='3' color='primary' style='opacity: 0.7' />
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router';
  import { ref, watch } from 'vue';
  import Language from '../language/Language.vue';
  import Theme from '../theme/Theme.vue';

  const router = useRouter();
  const isVisible = ref(router.currentRoute.value.name !== 'SignIn');
  watch(router.currentRoute, () => {
    isVisible.value = router.currentRoute.value.name !== 'SignIn';
  });

  function goToHome (): void {
    router.push({ name: 'Home' });
  }
  function goToSignIn (): void {
    router.push({ name: 'SignIn' });
  }
</script>

<template>
  <v-app-bar elevation='0' extension-height='1'>
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

      <v-btn variant='flat' color='primary'>
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
  import Language from '../language/Language.vue';
  import Theme from '../theme/Theme.vue';

  const router = useRouter();

  function goToHome (): void {
    router.push({ name: 'Home' });
  }
</script>

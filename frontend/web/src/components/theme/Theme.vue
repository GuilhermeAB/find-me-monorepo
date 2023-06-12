<template>
  <v-tooltip location='bottom'>
    <template #activator='{ props }'>
      <v-btn
        :icon='global.current.value.dark ? "mdi-weather-sunny" : "mdi-weather-night"'
        class='mr-2'
        v-bind='props'
        @click='toggleTheme'
      />
    </template>

    <span>{{ $t(global.current.value.dark ? 'LightTheme' : 'DarkTheme') }}</span>
  </v-tooltip>
</template>

<script setup lang='ts'>
  import { onBeforeMount, inject } from 'vue';
  import { useTheme } from 'vuetify';

  import { Composer } from 'vue-i18n';

  const $i18n = inject<Composer>('$i18n');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const $t = $i18n!.t;

  const { global } = useTheme();

  onBeforeMount(() => {
    const theme = localStorage.getItem('theme');
    global.name.value = theme || global.name.value;

    localStorage.setItem('theme', global.name.value);
  });

  function toggleTheme (): void {
    global.name.value = global.current.value.dark ? 'light' : 'dark';

    localStorage.setItem('theme', global.name.value);
  }
</script>

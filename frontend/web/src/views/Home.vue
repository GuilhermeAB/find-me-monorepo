<template>
  <Dashboard />
</template>

<script lang='ts' setup>
  import { useHead } from 'unhead';
  import { Composer } from 'vue-i18n';
  import {
    inject,
  } from 'vue';
  import Dashboard from './dashboard/Dashboard.vue';

  const $i18n = inject<Composer>('$i18n');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const $t = $i18n!.t;

  useHead({
    meta: [
      {
        name: 'description',
        content: $t('AboutContentHead'),
      },
    ],
  });
</script>

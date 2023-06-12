<template>
  <v-menu location='bottom'>
    <template #activator='{ props: menu }'>
      <v-tooltip location='bottom'>
        <template #activator='{ props: tooltip }'>
          <v-btn
            icon='mdi-translate'
            class='mr-2'
            v-bind='mergeProps(menu, tooltip)'
          />
        </template>

        <span>{{ $t('Languages') }}</span>
      </v-tooltip>
    </template>

    <v-list class='pa-0'>
      <v-list-item
        v-for='(item, i) in items'
        :key='i'
        class='pa-2'
        @click='changeLanguage(item.key)'
      >
        <CountryFlag :country='item.flag' size='normal' />
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang='ts'>
  import {
    mergeProps,
    ref,
    watch,
    onBeforeMount,
    inject,
  } from 'vue';
  import { Composer } from 'vue-i18n';
  import { useLocale } from 'vuetify';
  import CountryFlag from 'vue-country-flag-next';

  const $i18n = inject<Composer>('$i18n');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const $t = $i18n!.t;
  const { current } = useLocale();

  onBeforeMount(() => {
    const language = localStorage.getItem('language');
    current.value = language || current.value;

    if ($i18n) {
      $i18n.locale.value = current.value;
    }

    localStorage.setItem('language', current.value);
  });

  const items = ref([
    { key: 'pt', flag: 'br' },
  ]);

  watch(current, () => {
    items.value = [
      { key: 'en', flag: 'us' },
      { key: 'pt', flag: 'br' },
    ].filter((item) => item.key !== current.value);
  });

  function changeLanguage (key: string): void {
    if ($i18n) {
      $i18n.locale.value = key;
    }

    current.value = key;
    localStorage.setItem('language', key);
  }
</script>

<template>
  <v-card
    :variant='isSelected ? "outlined" : "elevated"'
    :color='isSelected ? "primary" : ""'
    @click='selectAlert(item.id)'
  >
    <v-img
      cover
      aspect-ratio='1'
      :src='AlertService.image(item.id)'
      :height='imageHeight'
    >
      <v-row no-gutters>
        <v-avatar
          density='comfortable'
          variant='outlined'
          color='primary'
          class='ma-1'
        >
          <v-icon>
            {{ item.type === AlertType.Person ? 'mdi-account' : 'mdi-paw' }}
          </v-icon>
        </v-avatar>

        <v-spacer />

        <div v-if='item.info.isPCD'>
          <v-tooltip location='bottom'>
            <template #activator='{ props: tooltipProps }'>
              <v-chip
                color='primary'
                variant='flat'
                class='ma-1'
                v-bind='tooltipProps'
              >
                {{ $t(current === 'en' ? 'PWD' : 'PcD') }}
              </v-chip>
            </template>

            <span>{{ $t('PcDLabel') }}</span>
          </v-tooltip>
        </div>
      </v-row>

      <v-row
        no-gutters
        align-content='end'
        style='height: 80%'
      >
        <v-chip variant='outlined' color='primary' class='ma-1'>
          {{ $t('Age', { value: differenceInYears(new Date(), new Date(item.birthDate)) }) }}
        </v-chip>
      </v-row>

      <template #placeholder>
        <v-row
          class='fill-height ma-0'
          align='center'
          justify='center'
        >
          <v-progress-circular
            indeterminate
            color='grey-lighten-5'
          />
        </v-row>
      </template>

      <v-overlay
        v-if='item.status != AlertStatus.Open'
        :model-value='true'
        contained
        no-click-animation
        persistent
        :scrim='item.status === AlertStatus.Closed ? "error" : "success"'
        class='align-center justify-center'
      >
        <v-chip :color='item.status === AlertStatus.Closed ? "error" : "primary"' variant='flat'>
          {{ $t(item.status) }}
        </v-chip>
      </v-overlay>
    </v-img>

    <v-card-item class='py-1 px-2'>
      <template #title>
        <span class='text-subtitle-1'>
          {{ item.name }}
        </span>
      </template>

      <template #subtitle>
        <v-tooltip location='bottom'>
          <template #activator='{ props: tooltipProps }'>
            <span v-bind='tooltipProps'>
              {{ missingLabel }}
            </span>
          </template>

          <span>{{ formattedDate }}</span>
        </v-tooltip>
      </template>
    </v-card-item>

    <v-card-text
      class='pa-2'
      :class='{
        "bg-grey-darken-3": global.name.value === "dark",
        "bg-grey-lighten-3": global.name.value === "light"
      }'
    >
      <v-btn
        v-if='isSelected'
        block
        color='primary'
        variant='outlined'
        @click.stop='openDetails'
      >
        <v-icon>
          mdi-eye-outline
        </v-icon>

        <span class='ml-2 hidden-md-and-down'>
          {{ $t('Details') }}
        </span>
      </v-btn>

      <div v-else class='text-container'>
        <span class='multiline-text'>
          {{ item.description }}
        </span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang='ts'>
  import { formatDistance, format, differenceInYears } from 'date-fns';
  import ptBR from 'date-fns/locale/pt-BR';
  import enUS from 'date-fns/locale/en-US';
  import { useLocale, useTheme } from 'vuetify';
  import {
    watch, ref, computed, inject,
  } from 'vue';
  import { useI18n, Composer } from 'vue-i18n';
  import { useRouter } from 'vue-router';
  import { AlertService, AlertStatus, AlertType } from '@/services';
  import { useAlertStore } from '../../../../store/alert';

  const $i18n = inject<Composer>('$i18n');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const $t = $i18n!.t;

  const props = defineProps({
    item: {
      type: Object,
      required: true,
    },
    imageHeight: {
      type: String,
      default: '16rem',
    },
  });

  const alert = useAlertStore();
  const isSelected = computed(() => alert.selected === props.item.id);

  const router = useRouter();
  const { global } = useTheme();
  const { current } = useLocale();
  const { t } = useI18n();

  function getMissingLabel (): string {
    const value = formatDistance(
      new Date(props.item.disappearDate),
      new Date(),
      {
        locale: current.value === 'en' ? enUS : ptBR,
      },
    );

    return t('MissingFor', { value: value });
  }

  const formattedDate = format(new Date(props.item.disappearDate), 'dd/MM/yyyy HH:mm');
  const missingLabel = ref(getMissingLabel());
  watch(current, () => {
    missingLabel.value = getMissingLabel();
  });

  function selectAlert (id: string): void {
    alert.setSelectedId(id);
  }

  function openDetails (): void {
    if (alert.selected) {
      alert.setSelectedId(undefined);
    }

    router.push({ name: 'Alert', params: { id: props.item.id } });
  }
</script>

<style scoped>
  .text-container {
    line-height: 1; /* Adjust the line height as needed */
    max-height: 2.8em; /* Set the maximum height for the multiline text */
    min-height: 2.8em;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }

  .multiline-text {
    display: -webkit-box;
    -webkit-line-clamp: 3; /* Set the maximum number of lines to display */
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>

<template>
  <v-container fluid>
    <v-row class='align-center justify-center'>
      <v-col
        cols='12'
        sm='12'
        md='8'
        lg='8'
        xl='8'
        xxl='8'
      >
        <v-row>
          <v-col
            cols='12'
            sm='4'
          >
            <v-card flat>
              <v-card-text class='pa-7'>
                <v-row>
                  <v-text-field
                    v-model='filterText'
                    hide-details
                    clearable
                    variant='outlined'
                    density='comfortable'
                    prepend-inner-icon='mdi-magnify'
                    :label='$t("Search")'
                  />
                </v-row>

                <v-row class='mt-8'>
                  <span>
                    {{ $t('Type') }}
                  </span>
                </v-row>

                <v-row align='center'>
                  <v-col cols='12' sm='8' md='7'>
                    <v-chip-group v-model='alertType' column color='primary'>
                      <v-chip v-for='typeFilter in Object.values(AlertType)' :key='typeFilter' filter :value='typeFilter'>
                        {{ $t(typeFilter) }}
                      </v-chip>
                    </v-chip-group>
                  </v-col>

                  <v-col cols='12' sm='4' md='5'>
                    <v-row justify='end'>
                      <v-btn color='primary' variant='text' @click='showFilters = !showFilters'>
                        <v-icon>
                          {{ !showFilters ? 'mdi-plus' : 'mdi-minus' }}
                        </v-icon>

                        <span>
                          {{ $t('Filters') }}
                        </span>
                      </v-btn>
                    </v-row>
                  </v-col>
                </v-row>

                <v-expand-transition>
                  <div v-if='showFilters'>
                    <v-row class='mt-5'>
                      <span>
                        {{ $t('Status') }}
                      </span>
                    </v-row>

                    <v-row>
                      <v-chip-group v-model='alertStatus' mandatory column color='primary'>
                        <v-chip v-for='statusFilter in Object.values(AlertStatus)' :key='statusFilter' filter :value='statusFilter'>
                          {{ $t(statusFilter) }}
                        </v-chip>
                      </v-chip-group>
                    </v-row>

                    <v-row class='mt-5'>
                      <span>
                        {{ $t('BirthDateAge') }}
                      </span>
                    </v-row>

                    <v-row>
                      <v-chip-group v-model='ageFilter' column color='primary'>
                        <v-chip v-for='age in ageFilters' :key='age.value' filter :value='age.value'>
                          {{ $t(age.label, { value: Math.abs(Number(age.value)) }) }}
                        </v-chip>
                      </v-chip-group>
                    </v-row>

                    <v-row v-if='ageFilter === "Custom"' class='mt-10'>
                      <v-range-slider
                        v-model='ageCustomFilter'
                        color='primary'
                        step='1'
                        thumb-label='always'
                      />
                    </v-row>

                    <v-row class='mt-5'>
                      <span>
                        {{ $t('MissingFor') }}
                      </span>
                    </v-row>

                    <v-row>
                      <v-chip-group v-model='missingForFilter' column color='primary'>
                        <v-chip v-for='age in missingForFilters' :key='age.value' filter :value='age.value'>
                          {{ $t(age.label, { value: Math.abs(Number(age.value)) }) }}
                        </v-chip>
                      </v-chip-group>
                    </v-row>

                    <v-row v-if='missingForFilter === "Custom"' class='mt-10'>
                      <v-range-slider
                        v-model='missingCustomFilter'
                        color='primary'
                        step='1'
                        thumb-label='always'
                      />
                    </v-row>
                  </div>
                </v-expand-transition>

                <v-row class='mt-5'>
                  <v-btn
                    block
                    color='primary'
                    variant='outlined'
                    :loading='isLoading'
                    @click='getAlerts'
                  >
                    {{ $t('Search') }}
                  </v-btn>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <v-divider vertical />

          <v-col
            cols='12'
            sm='8'
          >
            <v-row no-gutters class='my-3'>
              <span class='text-h5'>
                {{ $t('Alerts') }}
              </span>
            </v-row>

            <v-row v-if='!alerts' no-gutters>
              <v-sheet
                class='d-flex align-center justify-center flex-wrap text-center mx-auto'
                rounded
                width='100%'
                min-width='100'
                min-height='100'
              >
                <div>
                  <p class='text-body-2'>
                    <v-icon class='mr-3'>
                      mdi-message-alert-outline
                    </v-icon>

                    {{ $t('SearchEmptyAlertList') }}
                  </p>
                </div>
              </v-sheet>
            </v-row>

            <v-row v-else no-gutters>
              <v-col
                v-for='item in alerts'
                :key='item.id'
                cols='12'
                sm='6'
                md='6'
                lg='4'
                xl='4'
                xxl='3'
                class='pa-0 pb-2 px-1'
              >
                <AlertListItem :item='item' />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang='ts'>
  import {
    inject, ref, onMounted,
  } from 'vue';
  import { Composer } from 'vue-i18n';
  import {
    AlertType, AlertService, AlertStatus, Alert,
  } from '@/services';
  import AlertListItem from '../dashboard/components/alert/AlertListItem.vue';

  const $i18n = inject<Composer>('$i18n');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const $t = $i18n!.t;

  const showFilters = ref(false);
  const isLoading = ref(false);

  const filterText = ref<string | undefined>();
  const alertStatus = ref(AlertStatus.Open);
  const alertType = ref<string | undefined>();
  const ageFilter = ref<number | string | undefined>();
  const missingForFilter = ref<number | string | undefined>();
  const ageCustomFilter = ref([6, 20]);
  const missingCustomFilter = ref([6, 20]);

  const alerts = ref<Alert[] | undefined>([]);

  const ageFilters = ref<{
    label: string,
    value: number | string,
  }[]>([
    {
      label: 'LessThanAge',
      value: -3,
    },
    {
      label: 'LessThanAge',
      value: -12,
    },
    {
      label: 'LessThanAge',
      value: -18,
    },
    {
      label: 'MoreThanAge',
      value: 18,
    },
    {
      label: 'MoreThanAge',
      value: 30,
    },
    {
      label: 'Custom',
      value: 'Custom',
    },
  ]);

  const missingForFilters = ref<{
    label: string,
    value: number | string,
  }[]>([
    {
      label: 'LessThanAge',
      value: -3,
    },
    {
      label: 'MoreThanAge',
      value: 10,
    },
    {
      label: 'Custom',
      value: 'Custom',
    },
  ]);

  async function getAlerts (): Promise<void> {
    try {
      isLoading.value = true;
      let ageOption: number[] | undefined;
      let missingForOption: number[] | undefined;

      if (ageFilter.value) {
        if (typeof ageFilter.value === 'string' && ageFilter.value === 'Custom') {
          ageOption = ageCustomFilter.value;
        } else if (Number(ageFilter.value) > 0) {
          ageOption = [Number(ageFilter.value), 200];
        } else {
          ageOption = [0, Math.abs(Number(ageFilter.value))];
        }
      }

      if (missingForFilter.value) {
        if (typeof missingForFilter.value === 'string' && missingForFilter.value === 'Custom') {
          missingForOption = missingCustomFilter.value;
        } else if (Number(missingForFilter.value) > 0) {
          missingForOption = [Number(missingForFilter.value), 200];
        } else {
          missingForOption = [0, Math.abs(Number(missingForFilter.value))];
        }
      }

      const list = await AlertService.search(
        {
          status: alertStatus.value,
          type: alertType.value,
          startAge: ageOption ? ageOption[0] : ageOption || undefined,
          endAge: ageOption ? ageOption[1] : ageOption || undefined,
          missingAgeStart: missingForOption ? missingForOption[0] : missingForOption || undefined,
          missingAgeEnd: missingForOption ? missingForOption[1] : missingForOption || undefined,
        },
        filterText.value,
      );

      alerts.value = list;
    } finally {
      isLoading.value = false;
    }
  }

  onMounted(() => {
    getAlerts();
  });
</script>

<template>
  <v-container fluid>
    <v-row class='align-center justify-center'>
      <v-col
        cols='12'
        sm='12'
        md='8'
        lg='6'
        xl='6'
        xxl='6'
      >
        <v-row v-if='item'>
          <v-col
            cols='12'
            sm='4'
            md='4'
            lg='4'
            xl='3'
            xxl='3'
          >
            <v-card variant='flat'>
              <v-img
                cover
                aspect-ratio='1'
                :src='AlertService.image(id)'
                height='24rem'
              >
                <v-row no-gutters>
                  <v-avatar
                    density='comfortable'
                    variant='tonal'
                    color='primary'
                    class='ma-1'
                  >
                    <v-icon>
                      {{ item.type === AlertType.Person ? 'mdi-account' : 'mdi-paw' }}
                    </v-icon>
                  </v-avatar>
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
                  <v-chip :color='item.status === AlertStatus.Closed ? "error" : "primary"' variant='flat' class='text-h6'>
                    {{ $t(item.status) }}
                  </v-chip>
                </v-overlay>
              </v-img>
            </v-card>
          </v-col>

          <v-col
            cols='12'
            sm='8'
            md='8'
            lg='8'
            xl='9'
            xxl='9'
          >
            <v-card-item class='pa-0'>
              <v-card-title>
                <v-row no-gutters align='center'>
                  {{ item.name }}

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

                  <v-menu location='bottom'>
                    <template #activator='{ props }'>
                      <v-btn
                        icon
                        variant='outlined'
                        density='comfortable'
                        color='primary'
                        class='ml-1'
                        v-bind='props'
                      >
                        <v-icon>
                          mdi-dots-vertical
                        </v-icon>
                      </v-btn>
                    </template>

                    <v-list class='pa-0'>
                      <v-list-item
                        v-if='canEdit'
                        @click='newAlertDialog = true'
                      >
                        {{ $t('Edit') }}
                      </v-list-item>

                      <v-list-item
                        v-if='canEdit && item.status === AlertStatus.Open'
                        @click='resolveAlertDialog = true'
                      >
                        {{ $t('CloseAlert') }}
                      </v-list-item>

                      <v-list-item @click='printPoster'>
                        {{ $t('PrintPoster') }}
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-row>
              </v-card-title>

              <v-card-subtitle v-if='item.info.petType'>
                {{ $t(item.info.petType) }}
              </v-card-subtitle>
            </v-card-item>

            <v-divider class='mt-1 mb-4' />

            <div style='height: 75%'>
              <div>
                <span class='font-weight-medium'>
                  {{ $t('BirthDate') }}:
                </span>
                <span class='text-body-2'>
                  {{ birthDateFormatted }}

                  <span class='text-caption'>
                    ({{ $t('Age', { value: age }) }})
                  </span>
                </span>
              </div>

              <div>
                <span class='font-weight-medium'>
                  {{ $t('DisappearDate') }}:
                </span>
                <span class='text-body-2'>
                  {{ disappearDateFormatted }}

                  <span class='text-caption'>
                    ({{ disappearDateLabel }})
                  </span>
                </span>
              </div>

              <div class='text-body-2 text-container mt-4'>
                <span>
                  {{ item.description }}
                </span>
              </div>
            </div>

            <v-row no-gutters align='center'>
              <div class='text-caption'>
                <span>
                  {{ $t('AlertCreatedBy', { value: item.account.person.name }) }}
                </span>
              </div>
            </v-row>
          </v-col>
        </v-row>

        <v-row v-if='item' class='mt-10'>
          <v-col cols='12'>
            <v-card-item class='pa-0'>
              <v-card-title>
                <v-row no-gutters align='center'>
                  <span>
                    <v-icon size='x-small'>
                      mdi-map
                    </v-icon>

                    {{ $t('LastSeenAt') }}
                  </span>
                </v-row>
              </v-card-title>

              <v-divider class='mb-3' />
            </v-card-item>

            <v-sheet width='100%' height='200'>
              <l-map
                :zoom='16'
                :min-zoom='10'
                :use-global-leaflet='false'
                :center='[item.location.coordinates[1], item.location.coordinates[0]]'
              >
                <l-tile-layer
                  v-if='global.current.value.dark'
                  url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                  layer-type='base'
                  name='OpenStreetMap'
                  class-name='map-tiles'
                />

                <l-tile-layer
                  v-else
                  url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                  layer-type='base'
                  name='OpenStreetMap'
                />

                <l-marker
                  :lat-lng='[item.location.coordinates[1], item.location.coordinates[0]]'
                >
                  <l-icon class-name='map-icon-custom-class'>
                    <v-icon
                      size='36'
                      color='error'
                      class='pr-3 pb-3'
                    >
                      mdi-map-marker
                    </v-icon>
                  </l-icon>
                </l-marker>
              </l-map>
            </v-sheet>
          </v-col>
        </v-row>

        <v-row v-if='item'>
          <v-col cols='12'>
            <AlertComment :id='id' :owner-id='item.account.id' />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>

  <v-dialog
    v-model='newAlertDialog'
    fullscreen
    persistent
    :scrim='false'
    transition='dialog-bottom-transition'
  >
    <v-card>
      <v-toolbar
        color='primary'
      >
        <v-btn
          icon
          @click='newAlertDialog = false'
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ $t('EditAlert') }}</v-toolbar-title>
      </v-toolbar>

      <v-container fluid>
        <v-row class='align-center justify-center'>
          <v-col
            cols='12'
            sm='12'
            md='8'
            lg='6'
            xl='6'
            xxl='6'
          >
            <AlertCreate :alert='item' @updated='getAlert' @close='newAlertDialog = false' />
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>

  <v-dialog
    v-model='resolveAlertDialog'
    transition='dialog-bottom-transition'
    width='50%'
  >
    <v-card>
      <v-card-title>
        <v-row no-gutters justify='center'>
          {{ $t('AlertResolvedLabel') }}
        </v-row>
      </v-card-title>

      <v-card-actions>
        <v-row no-gutters justify='center'>
          <v-btn variant='outlined' @click='updateStatus(false)'>
            {{ $t('No') }}
          </v-btn>

          <v-btn variant='flat' color='primary' @click='updateStatus(true)'>
            {{ $t('Yes') }}
          </v-btn>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog
    v-model='printDialog'
    fullscreen
    persistent
    :scrim='false'
    transition='dialog-bottom-transition'
  >
    <v-card v-if='item'>
      <v-toolbar
        class='d-print-none'
        color='primary'
      >
        <v-btn
          icon
          @click='printDialog = false'
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ $t('PrintPoster') }}</v-toolbar-title>

        <v-spacer />

        <v-btn icon @click='printPage'>
          <v-icon>
            mdi-printer
          </v-icon>
        </v-btn>
      </v-toolbar>

      <v-container fluid>
        <v-row class='align-center justify-center'>
          <v-col
            cols='12'
            sm='12'
            md='8'
            lg='6'
            xl='6'
            xxl='6'
          >
            <v-row justify='center'>
              <span class='text-h3 mt-2 mb-4'>
                {{ $t('Missing') }}
              </span>
            </v-row>

            <v-row justify='center'>
              <v-card variant='flat'>
                <v-img
                  cover
                  aspect-ratio='1'
                  :src='AlertService.image(id)'
                  height='24rem'
                />
              </v-card>
            </v-row>

            <v-row justify='center'>
              <span class='text-h4 my-2'>
                {{ item.name }}
                <span class='text-h5'>
                  ({{ $t('Age', { value: age }) }})
                </span>
              </span>
            </v-row>

            <v-row justify='center' class='mt-2'>
              <span>
                <span class='font-weight-medium'>
                  {{ $t('DisappearDate') }}:
                </span>
                <span class='text-body-2'>
                  {{ disappearDateFormatted }}

                  <span class='text-caption'>
                    ({{ disappearDateLabel }})
                  </span>
                </span>
              </span>
            </v-row>

            <v-row justify='center'>
              <v-card flat width='80%' min-width='350'>
                <v-card-text class='text-body-1'>
                  {{ item.description }}
                </v-card-text>
              </v-card>
            </v-row>

            <v-row>
              <v-col cols='12'>
                <v-card-item class='pa-0'>
                  <v-card-title>
                    <v-row no-gutters align='center'>
                      <span>
                        <v-icon size='x-small'>
                          mdi-map
                        </v-icon>

                        {{ $t('LastSeenAt') }}
                      </span>
                    </v-row>
                  </v-card-title>

                  <v-divider class='mb-3' />
                </v-card-item>

                <v-sheet width='100%' height='150'>
                  <l-map
                    :zoom='16'
                    :min-zoom='10'
                    :use-global-leaflet='false'
                    :center='[item.location.coordinates[1], item.location.coordinates[0]]'
                  >
                    <l-tile-layer
                      v-if='global.current.value.dark'
                      url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                      layer-type='base'
                      name='OpenStreetMap'
                      class-name='map-tiles'
                    />

                    <l-tile-layer
                      v-else
                      url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                      layer-type='base'
                      name='OpenStreetMap'
                    />

                    <l-marker
                      :lat-lng='[item.location.coordinates[1], item.location.coordinates[0]]'
                    >
                      <l-icon class-name='map-icon-custom-class'>
                        <v-icon
                          size='36'
                          color='error'
                          class='pr-3 pb-3'
                        >
                          mdi-map-marker
                        </v-icon>
                      </l-icon>
                    </l-marker>
                  </l-map>
                </v-sheet>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script setup lang='ts'>
  import { useRoute } from 'vue-router';
  import {
    onMounted, ref, watch, inject,
  } from 'vue';
  import {
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
  } from '@vue-leaflet/vue-leaflet';
  import L from 'leaflet';
  import { useLocale, useTheme } from 'vuetify';
  import { formatDistance, format, differenceInYears } from 'date-fns';
  import ptBR from 'date-fns/locale/pt-BR';
  import enUS from 'date-fns/locale/en-US';
  import { Composer } from 'vue-i18n';
  import {
    Alert, AlertService, AlertStatus, AlertType,
  } from '@/services';
  import AlertComment from './AlertComment.vue';
  import AlertCreate from '../dashboard/components/alert/AlertCreate.vue';
  import { useAuthenticationStore } from '@/store/authentication';

  const $i18n = inject<Composer>('$i18n');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const $t = $i18n!.t;

  const { global } = useTheme();
  const route = useRoute();
  const id = route.params.id as string;

  const { current } = useLocale();
  const authentication = useAuthenticationStore();

  const item = ref<Alert>();
  const newAlertDialog = ref(false);
  const resolveAlertDialog = ref(false);
  const printDialog = ref(false);
  const canEdit = ref(false);

  function getDisappearDateLabel (): string {
    if (item.value) {
      return formatDistance(
        new Date(item.value.disappearDate),
        new Date(),
        {
          locale: current.value === 'en' ? enUS : ptBR,
        },
      );
    }

    return '';
  }

  let birthDateFormatted: string;
  let disappearDateFormatted: string;
  const disappearDateLabel = ref(getDisappearDateLabel());
  let age: number;

  async function getAlert (): Promise<void> {
    item.value = await AlertService.getById(id);

    if (item.value) {
      birthDateFormatted = format(new Date(`${item.value.birthDate.toString().substring(0, 10)} 12:00:00`), 'dd/MM/yyyy');
      disappearDateFormatted = format(new Date(item.value.disappearDate), 'dd/MM/yyyy HH:mm');

      disappearDateLabel.value = getDisappearDateLabel();
      age = differenceInYears(new Date(), new Date(item.value.birthDate));

      canEdit.value = !!(authentication.currentUser && item.value.account.id === authentication.currentUser.id);
    }
  }

  onMounted(async () => {
    await getAlert();
  });

  watch(current, () => {
    disappearDateLabel.value = getDisappearDateLabel();
  });

  async function updateStatus (value: boolean): Promise<void> {
    if (item.value) {
      const status = value ? AlertStatus.Resolved : AlertStatus.Closed;
      await AlertService.updateStatus(item.value.id, status);

      item.value.status = status;
      resolveAlertDialog.value = false;
    }
  }

  function printPage (): void {
    window.print();
  }

  function printPoster (): void {
    printDialog.value = true;

    setTimeout(() => {
      printPage();
    }, 1500);
  }
</script>

<style scoped>
  .text-container {
    line-height: 1.2;
  }
</style>

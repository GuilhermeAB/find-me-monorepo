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
            md='4'
            lg='3'
            xl='3'
            xxl='3'
          >
            <v-card variant='tonal'>
              <v-img
                cover
                aspect-ratio='1'
                height='22rem'
              >
                <!-- <v-row no-gutters justify='end'>
                  <v-btn
                    icon
                    variant='tonal'
                    density='comfortable'
                    color='primary'
                    class='ma-1'
                  >
                    <v-icon>
                      mdi-pencil
                    </v-icon>
                  </v-btn>
                </v-row> -->

                <template #placeholder>
                  <v-row
                    class='fill-height ma-0'
                    align='center'
                    justify='center'
                  >
                    <!-- <v-progress-circular
                      indeterminate
                      color='grey-lighten-5'
                    /> -->

                    <v-icon size='75' color='primary'>
                      mdi-account
                    </v-icon>
                  </v-row>
                </template>
              </v-img>
            </v-card>

            <v-card variant='flat' class='mt-3'>
              <v-card-title class='pb-0 text-body-1'>
                {{ account?.person.name }}
              </v-card-title>

              <v-card-subtitle class='text-caption'>
                {{ account?.email }}
              </v-card-subtitle>

              <v-card-text>
                <v-btn
                  block
                  variant='outlined'
                  density='comfortable'
                  color='primary'
                  @click='editProfileDialog = true'
                >
                  {{ $t('EditProfile') }}
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col
            cols='12'
            sm='8'
            md='8'
            lg='9'
            xl='9'
            xxl='9'
            class='px-0'
          >
            <v-container class='px-2 pt-2'>
              <v-row>
                <span class='text-h6'>
                  {{ $t('MyAlerts') }}

                  <span class='text-body-2'>
                    ({{ alertList?.length }})
                  </span>
                </span>
                <v-divider class='mt-1 mb-2' />
              </v-row>

              <v-row>
                <v-col
                  v-for='item in alertList'
                  :key='item.id'
                  cols='12'
                  sm='4'
                  md='3'
                  lg='3'
                  xl='3'
                  xxl='3'
                  class='pa-0 pb-2 px-1'
                >
                  <AlertListItem :item='item' image-height='10rem' />
                </v-col>

                <v-col
                  v-if='!alertList || !alertList.length'
                  cols='12'
                  sm='12'
                  md='12'
                  lg='12'
                  xl='12'
                  xxl='12'
                  class='px-1 py-1'
                >
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

                        {{ $t('NoAlertsFound') }}
                      </p>
                    </div>
                  </v-sheet>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>

  <v-dialog
    v-model='editProfileDialog'
    persistent
    :fullscreen='mobile'
    :width='mobile ? "100%" : "50%"'
    transition='dialog-bottom-transition'
  >
    <v-card>
      <v-toolbar
        color='primary'
      >
        <v-btn
          icon
          @click='editProfileDialog = false'
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ $t('EditProfile') }}</v-toolbar-title>
      </v-toolbar>

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
            <ProfileEdit @updated='updateAccount' />
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script setup lang='ts'>
  import { inject, ref, onMounted } from 'vue';
  import { Composer } from 'vue-i18n';
  import { useDisplay } from 'vuetify';
  import { useAuthenticationStore } from '@/store/authentication';
  import AlertListItem from '../dashboard/components/alert/AlertListItem.vue';
  import ProfileEdit from './components/ProfileEdit.vue';
  import { Alert, AlertService } from '@/services';

  const $i18n = inject<Composer>('$i18n');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const $t = $i18n!.t;
  const { mobile } = useDisplay();

  const authentication = useAuthenticationStore();

  const account = ref(authentication.currentUser);

  const editProfileDialog = ref(false);

  const alertList = ref<Alert[] | undefined>();
  onMounted(async () => {
    alertList.value = await AlertService.listByUser();
  });

  async function updateAccount (): Promise<void> {
    await authentication.loggedUser();
    editProfileDialog.value = false;
    account.value = authentication.currentUser;
  }
</script>
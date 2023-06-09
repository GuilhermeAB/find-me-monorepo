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
                alt='account image'
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

            <v-card variant='tonal' class='mt-3'>
              <v-card-title class='pb-0 text-body-1'>
                {{ authentication.currentUser?.person.name }}
              </v-card-title>

              <v-card-subtitle class='text-caption'>
                {{ authentication.currentUser?.email }}
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
            <ProfileAlerts />
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
  import {
    inject, ref, watch,
  } from 'vue';
  import { Composer } from 'vue-i18n';
  import { useDisplay } from 'vuetify';
  import { useRouter } from 'vue-router';
  import { useAuthenticationStore } from '@/store/authentication';
  import ProfileEdit from './components/ProfileEdit.vue';
  import ProfileAlerts from './components/ProfileAlerts.vue';

  const $i18n = inject<Composer>('$i18n');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const $t = $i18n!.t;
  const {
    mobile,
  } = useDisplay();
  const router = useRouter();

  const authentication = useAuthenticationStore();

  const account = ref(authentication.currentUser);
  watch(account, () => {
    if (!account.value) {
      router.replace({ name: 'Home' });
    }
  });

  const editProfileDialog = ref(false);

  async function updateAccount (): Promise<void> {
    await authentication.loggedUser();
    editProfileDialog.value = false;
    account.value = authentication.currentUser;
  }
</script>

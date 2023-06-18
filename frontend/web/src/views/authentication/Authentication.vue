<template>
  <v-container fluid fill-height class='pa-0' style='height: 100%;'>
    <v-row no-gutters style='height: 100%;'>
      <v-col md='7' class='hidden-sm-and-down bg-primary' style='height: 100%;'>
        <v-row no-gutters align='center' justify='center' style='height: 100%;'>
          <!-- <v-img
            max-height='250'
            max-width='250'
            src='../../assets/logo.png'
          /> -->
          <v-icon size='175'>
            mdi-crosshairs
          </v-icon>
        </v-row>
      </v-col>

      <v-col sm='12' md='5'>
        <v-row no-gutters align='center' style='height: 10%'>
          <v-tooltip location='bottom'>
            <template #activator='{ props }'>
              <v-btn
                variant='plain'
                style='opacity: 1'
                class='ml-5'
                v-bind='props'
                @click='goToHome'
              >
                <v-icon size='large' color='primary'>
                  mdi-arrow-left
                </v-icon>

                <span class='text-h5 font-weight-bold ml-2'>
                  {{ $t('Home') }}
                </span>
              </v-btn>
            </template>

            <span>
              {{ $t('HomePage') }}
            </span>
          </v-tooltip>
        </v-row>

        <v-row no-gutters align='center' justify='center' style='height: 90%'>
          <SignIn
            v-if='step === Steps.SignIn'
            @sign-up='setStep(Steps.SignUp)'
            @forgot-password='setStep(Steps.ForgotPassword)'
          />

          <SignUp
            v-else-if='step === Steps.SignUp'
            @sign-in='setStep(Steps.SignIn)'
          />

          <RecoverPassword
            v-else
            @sign-in='setStep(Steps.SignIn)'
          />
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang='ts'>
  import {
    ref,
    inject,
  } from 'vue';
  import { useRouter } from 'vue-router';
  import { Composer } from 'vue-i18n';
  import SignIn from './components/sign-in/SignIn.vue';
  import SignUp from './components/sign-up/SignUp.vue';
  import RecoverPassword from './components/recover-password/RecoverPassword.vue';

  const $i18n = inject<Composer>('$i18n');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const $t = $i18n!.t;

  const router = useRouter();

  const Steps = {
    SignIn: 'sign-in',
    SignUp: 'sign-up',
    ForgotPassword: 'forgot-password',
  };

  const step = ref(Steps.SignIn);

  function goToHome (): void {
    router.replace({ name: 'Home' });
  }

  function setStep (value: string): void {
    step.value = value;
  }
</script>

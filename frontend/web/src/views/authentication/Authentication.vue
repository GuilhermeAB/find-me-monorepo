<template>
  <v-container fluid fill-height class='pa-0' style='height: 100%;'>
    <v-row no-gutters style='height: 100%;'>
      <v-col md='7' class='hidden-sm-and-down bg-primary' style='height: 100%;'>
        <v-row no-gutters align='center' justify='center' style='height: 100%;'>
          <v-img
            max-height='250'
            max-width='250'
            src='../../assets/logo.png'
          />
        </v-row>
      </v-col>

      <v-col sm='12' md='5'>
        <v-row no-gutters align='center' justify='center' style='height: 100%'>
          <SignIn />
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang='ts'>
  import SignIn from './components/sign-in/SignIn.vue';
</script>

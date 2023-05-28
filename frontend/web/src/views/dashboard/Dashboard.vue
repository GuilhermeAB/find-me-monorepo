<template>
  <v-container fluid class='fill-height'>
    <v-row class='fill-height'>
      <v-col
        cols='12'
        sm='6'
        md='7'
        lg='7'
        xl='7'
        xxl='7'
        class='pa-1'
      >
        <v-sheet
          rounded
          width='100%'
          height='100%'
          min-height='250'
          :max-height='maxHeight'
        >
          <Map />
        </v-sheet>
      </v-col>

      <v-col
        cols='12'
        sm='6'
        md='5'
        lg='5'
        xl='5'
        xxl='5'
        class='pa-1'
      >
        <Search />

        <!-- :max-height='maxHeight - 105' -->

        <v-sheet
          color='transparent'
          width='100%'
          height='100%'
          :max-height='maxHeight - 63'
          style='overflow: auto;'
        >
          <AlertList />
        </v-sheet>

        <!-- <v-pagination
          density='comfortable'
          class='my-1'
          :length='6'
        /> -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang='ts'>
  import { onMounted, computed } from 'vue';
  import { useDisplay } from 'vuetify';
  import Map from './components/map/Map.vue';
  import AlertList from './components/alert/AlertList.vue';
  import Search from './components/search/Search.vue';
  import { useAlertStore } from '../../store/alert';

  const { height } = useDisplay();
  const alert = useAlertStore();

  onMounted(() => {
    alert.getList();
  });

  const maxHeight = computed(() => height.value - 100);
</script>

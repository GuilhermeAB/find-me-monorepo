<template>
  <l-map
    ref='map'
    v-model='zoom'
    v-model:zoom='zoom'
    :min-zoom='10'
    :use-global-leaflet='false'
    :center='mapCenter'
    @update:center='mapCenterUpdated'
    @update:zoom='mapZoomUpdated'
    @ready='mapReady'
  >
    <l-tile-layer
      url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      layer-type='base'
      name='OpenStreetMap'
    />

    <div v-if='alert.list && alert.list.length'>
      <l-marker
        v-for='item in alert.list'
        :key='item.id'
        :lat-lng='[item.location.coordinates[1], item.location.coordinates[0]]'
        @click='alert.setSelectedId(item.id)'
      >
        <!-- <l-icon class-name='map-icon-custom-class'>
          <v-icon
            size='36'
            :color='alert.selected === item.id ? "primary" : "error"'
            class='pr-3 pb-3'
          >
            mdi-map-marker
          </v-icon>
        </l-icon> -->

        <l-icon
          class-name='marker-image'
          :icon-size='markerIconSize'
          :icon-anchor='markerIconAnchor'
          :icon-url='AlertService.image(item.id)'
        />

        <l-tooltip>{{ item.name }}</l-tooltip>
      </l-marker>
    </div>
  </l-map>
</template>

<script setup lang='ts'>
  import {
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
    LTooltip,
  } from '@vue-leaflet/vue-leaflet';
  import { ref, computed, watch } from 'vue';
  import L from 'leaflet';
  import { debounce } from 'lodash';
  import { useAlertStore } from '../../../../store/alert';
  import { AlertService } from '@/services';

  const alert = useAlertStore();

  const zoom = ref(12);
  const baseSize = 30;
  const markerIconSize = [baseSize, baseSize * 1.15] as L.PointExpression;
  const markerIconAnchor = [baseSize / 2, baseSize * 1.15] as L.PointExpression;

  let mapInstance: L.Map;
  function mapReady (value: L.Map): void {
    mapInstance = value;
  }

  const mapCenter = computed((): L.PointExpression => {
    if (alert.selectedLocation) {
      return [
        alert.selectedLocation.latitude,
        alert.selectedLocation.longitude,
      ];
    }

    if (mapInstance) {
      const latLgn = mapInstance.getCenter();

      return [latLgn.lat, latLgn.lng];
    }

    return [-25.383585, -49.242825];
  });

  watch(
    () => alert.selectedLocation,
    () => {
      if (alert.selectedLocation) {
        setTimeout(() => {
          zoom.value = 16;
        }, 300);
      }
    },
  );

  const mapCenterUpdated = debounce((value: {lat: number, lng: number}) => {
    if (!alert.selectedLocation) {
      alert.getNearby(value.lat, value.lng);
    } else if (mapInstance) {
      const bounds = mapInstance.getBounds(); // Get the current map bounds

      const isVisible = bounds.contains([
        alert.selectedLocation.latitude,
        alert.selectedLocation.longitude,
      ]);

      if (!isVisible) {
        alert.setSelectedId(undefined);
      }
    }

    alert.setMapCenter({ latitude: value.lat, longitude: value.lng });
  }, 750);

  const mapZoomUpdated = debounce((value: number) => {
    if (alert.selectedLocation && value <= 14) {
      alert.setSelectedId(undefined);
    }
  }, 500);
</script>

<style>
  .marker-image {
    border-radius: 50%;
  }
</style>

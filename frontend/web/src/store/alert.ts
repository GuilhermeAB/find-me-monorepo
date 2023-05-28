import { defineStore } from 'pinia';
import { AlertService, Alert } from '../services/alert';

interface LatLgn {
  latitude: number,
  longitude: number,
}
interface State {
  alerts?: Alert[]
  selectedId?: string,
  location?: LatLgn,
  alertType?: string,
  mapCenter: LatLgn,
}

export const useAlertStore = defineStore('alert', {
  state: (): State => ({
    alerts: [],
    selectedId: undefined,
    location: undefined,
    alertType: undefined,
    mapCenter: {
      latitude: -25.383585,
      longitude: -49.242825,
    },
  }),
  getters: {
    list: (state) => state.alerts,
    selected: (state) => state.selectedId,
    selectedLocation: (state) => state.location,
  },
  actions: {
    setLocation(location?: { latitude: number, longitude: number }) {
      this.location = location ? {
        latitude: location.latitude,
        longitude: location.longitude,
      } : undefined;
    },
    setSelectedId(id?: string) {
      if (!id || (this.selectedId && this.selectedId === id)) {
        this.selectedId = undefined;
        this.setLocation(undefined);
      } else {
        this.selectedId = id;

        const alert = this.list!.find((item) => item.id === id)!;
        this.setLocation({
          latitude: alert.location.coordinates[1],
          longitude: alert.location.coordinates[0],
        });
      }
    },
    setMapCenter(value: LatLgn) {
      this.mapCenter = value;
    },
    async getList() {
      this.alerts = await AlertService.list();
    },
    async getNearby(latitude: number, longitude: number, type?: string) {
      this.alerts = await AlertService.listNearby(latitude, longitude, type || this.alertType);
    },
    async updateList(type?: string) {
      const { latitude, longitude } = this.mapCenter;
      this.alertType = type;
      await this.getNearby(latitude, longitude, type);
    },
  },
});

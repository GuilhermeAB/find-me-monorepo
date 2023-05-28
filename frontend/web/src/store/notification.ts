import { defineStore } from 'pinia';
import { v4 as uuidV4 } from 'uuid';

export type ParamsType = Record<string, string | number | boolean>;

export interface Alert {
  id: string,
  code: string,
  type: string,
  message?: string,
  params?: ParamsType
}

interface State {
  alerts: Alert[]
}

export const useNotificationStore = defineStore('notification', {
  state: (): State => ({
    alerts: [],
  }),
  getters: {
    list: (state) => state.alerts,
  },
  actions: {
    add({
      type,
      code,
      message,
      params,
    }: Omit<Alert, 'id'>) {
      this.alerts.push({
        id: uuidV4(),
        code,
        type,
        message,
        params,
      });
    },
    remove(id: string) {
      this.alerts = this.alerts.filter((alert) => alert.id !== id);
    },
  },
});

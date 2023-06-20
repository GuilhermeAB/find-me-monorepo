/* eslint-disable eqeqeq */
import axios from 'axios';
import { User } from '../authentication';

export enum AlertType {
  Person = 'Person',
  Pet = 'Pet',
}

export enum PetType {
  Dog = 'Dog',
  Cat = 'Cat',
  Bird = 'Bird',
}

export enum AlertLocationType {
  Point = 'Point',
}

export interface Location {
  type: AlertLocationType,
  coordinates: number[],
}

export enum AlertStatus {
  Open = 'Open',
  Closed = 'Closed',
  Resolved = 'Resolved',
}

export interface Alert {
  id: string,
  type: AlertType,
  name: string,
  description: string,
  birthDate: Date | string,
  disappearDate: Date | string,
  location: Location,
  info: {
    isPCD?: boolean,
    petType?: PetType,
  },
  account: User,
  status: AlertStatus,
}

export interface CreateAlert {
  type: AlertType | string,
  name: string,
  description: string,
  birthDate: string,
  disappearDate: string,
  latitude: number,
  longitude: number,
  isPCD?: boolean,
  petType?: PetType | string,
}

export interface SearchFilter {
  status: string,
  type?: string,
  startAge?: number,
  endAge?: number,
  missingAgeStart?: number,
  missingAgeEnd?: number,
}

const url = import.meta.env.VITE_APP_ALERT_REQUEST_BASE_URL as string;

export class AlertService {
  public static image(id: string): string {
    return `${url}alert/image/${id}`;
  }

  public static async health(): Promise<void> {
    await axios({
      baseURL: url,
      url: 'alert/health',
      method: 'GET',
    });
  }

  public static async list(): Promise<Alert[] | undefined> {
    const { data } = await axios<{ value?: { list?: Alert[] } }>({
      baseURL: url,
      url: 'alert/list',
      method: 'GET',
    });

    return data?.value?.list;
  }

  public static async search(filters: SearchFilter, text?: string): Promise<Alert[] | undefined> {
    const { data } = await axios<{ value?: { list?: Alert[] } }>({
      baseURL: url,
      url: 'alert/search',
      method: 'POST',
      data: {
        search: text,
        status: filters.status,
        type: filters.type,
        startAge: filters.startAge,
        endAge: filters.endAge,
        missingAgeStart: filters.missingAgeStart,
        missingAgeEnd: filters.missingAgeEnd,
      },
    });

    return data?.value?.list;
  }

  public static async listByUser(): Promise<Alert[] | undefined> {
    const { data } = await axios<{ value?: { list?: Alert[] } }>({
      baseURL: url,
      url: 'alert/list-by-user',
      method: 'GET',
      withCredentials: true,
    });

    return data?.value?.list;
  }

  public static async listNearby(latitude: number, longitude: number, type?: string): Promise<Alert[] | undefined> {
    const { data } = await axios<{ value?: { list?: Alert[] } }>({
      baseURL: url,
      url: 'alert/list-nearby',
      method: 'POST',
      data: {
        latitude,
        longitude,
        type,
      },
    });

    return data?.value?.list;
  }

  public static async create(alert: CreateAlert, image?: Blob): Promise<void> {
    const [birthDay, birthMonth, birthYear] = alert.birthDate.split('/');
    const [disappearDay, disappearMonth, disappearYear] = alert.disappearDate.substring(0, 10).split('/');

    const form = new FormData();
    form.append('type', alert.type);
    form.append('name', alert.name);
    form.append('description', alert.description);
    form.append('birthDate', `${birthYear}-${birthMonth}-${birthDay}`);
    form.append('disappearDate', `${disappearYear}-${disappearMonth}-${disappearDay} ${alert.disappearDate.substring(11, 16)}`);
    form.append('latitude', alert.latitude.toString());
    form.append('longitude', alert.longitude.toString());

    if (alert.isPCD != undefined) {
      form.append('isPCD', String(alert.isPCD));
    }
    if (alert.petType) {
      form.append('petType', alert.petType);
    }

    if (image) {
      form.append('file', image);
    }

    await axios({
      baseURL: url,
      url: 'alert/create',
      method: 'POST',
      data: form,
      withCredentials: true,
    });
  }

  public static async update(id: string, alert: CreateAlert, image?: Blob): Promise<void> {
    const [birthDay, birthMonth, birthYear] = alert.birthDate.split('/');
    const [disappearDay, disappearMonth, disappearYear] = alert.disappearDate.substring(0, 10).split('/');

    const form = new FormData();
    form.append('type', alert.type);
    form.append('name', alert.name);
    form.append('description', alert.description);
    form.append('birthDate', `${birthYear}-${birthMonth}-${birthDay}`);
    form.append('disappearDate', `${disappearYear}-${disappearMonth}-${disappearDay} ${alert.disappearDate.substring(11, 16)}`);
    form.append('latitude', alert.latitude.toString());
    form.append('longitude', alert.longitude.toString());

    if (alert.isPCD != undefined) {
      form.append('isPCD', String(alert.isPCD));
    }
    if (alert.petType) {
      form.append('petType', alert.petType);
    }

    if (image) {
      form.append('file', image);
    }

    await axios({
      baseURL: url,
      url: `alert/update/${id}`,
      method: 'PUT',
      data: form,
      withCredentials: true,
    });
  }

  public static async getById(id: string): Promise<Alert | undefined> {
    const { data } = await axios<{ value?: Alert }>({
      baseURL: url,
      url: `alert/${id}`,
      method: 'GET',
    });

    return data?.value;
  }

  public static async updateStatus(id: string, status: string): Promise<void> {
    await axios({
      baseURL: url,
      url: `alert/update/status/${id}`,
      method: 'PATCH',
      withCredentials: true,
      data: {
        status,
      },
    });
  }
}

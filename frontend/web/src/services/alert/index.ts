/* eslint-disable eqeqeq */
import axios from 'axios';

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
  }
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

const url = import.meta.env.VITE_APP_ALERT_REQUEST_BASE_URL as string;

export class AlertService {
  public static image(id: string): string {
    return `${url}alert/image/${id}`;
  }

  public static async list(): Promise<Alert[] | undefined> {
    const { data } = await axios<{ value?: { list?: Alert[] } }>({
      baseURL: url,
      url: 'alert/list',
      method: 'GET',
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
    const form = new FormData();
    form.append('type', alert.type);
    form.append('name', alert.name);
    form.append('description', alert.description);
    form.append('birthDate', alert.birthDate);
    form.append('disappearDate', alert.disappearDate);
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
    });
  }

  public static async update(id: string, alert: CreateAlert, image?: Blob): Promise<void> {
    const form = new FormData();
    form.append('type', alert.type);
    form.append('name', alert.name);
    form.append('description', alert.description);
    form.append('birthDate', alert.birthDate);
    form.append('disappearDate', alert.disappearDate);
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
}

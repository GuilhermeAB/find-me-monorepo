import { CreateDateVO, DateVO } from '@find-me/date';
import { Entity } from '../../../base';
import { AlertPolicy } from './alert-base.policy';

export enum AlertTypeEnum {
  Person = 'Person',
  Pet = 'Pet',
}

export enum AlertLocationType {
  Point = 'Point',
}

export interface Location {
  type: AlertLocationType,
  coordinates: number[],
}

export interface AlertProps<T> {
  type: AlertTypeEnum,
  name: string,
  description: string,
  birthDate: DateVO,
  disappearDate: DateVO,
  location: Location,
  info: T,
}

export type CreateAlertProps<T> = Omit<AlertProps<T>, 'birthDate' | 'disappearDate' | 'type'> & {
  birthDate: CreateDateVO,
  disappearDate: CreateDateVO,
  info: T,
  type: string | AlertTypeEnum,
};

export class AlertEntity<T> extends Entity<AlertProps<T>> {
  public set name(value: string) {
    this.props.name = value;
  }

  public set description(value: string) {
    this.props.description = value;
  }

  public set birthDate(value: CreateDateVO) {
    this.props.birthDate = new DateVO(value);
  }

  public set disappearDate(value: CreateDateVO) {
    this.props.disappearDate = new DateVO(value);
  }

  public set location(value: Location) {
    this.props.location = value;
  }

  public set info(value: T) {
    this.props.info = value;
  }

  public static new<T>(create: CreateAlertProps<T>): AlertEntity<T> {
    const alert = new AlertEntity({
      props: {
        type: create.type as AlertTypeEnum,
        name: create.name.trim(),
        description: create.description.trim(),
        birthDate: new DateVO(create.birthDate),
        disappearDate: new DateVO(create.disappearDate),
        location: create.location,
        info: create.info,
      },
      timestamps: true,
    });

    alert.validate();

    return alert;
  }

  public validate(): void {
    AlertPolicy.validate(this.getProps());
  }
}

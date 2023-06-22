import { CreateDateVO, DateVO } from '@find-me/date';
import { UUID } from '@find-me/uuid';
import startCase from 'lodash.startcase';
import { Entity } from '../../../base';
import { AlertPolicy } from './alert-base.policy';
import { AccountEntity } from '../../account';

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

export enum AlertStatus {
  Open = 'Open',
  Closed = 'Closed',
  Resolved = 'Resolved',
}

export interface AlertProps<T> {
  type: AlertTypeEnum,
  name: string,
  description: string,
  birthDate: DateVO,
  disappearDate: DateVO,
  location: Location,
  info: T,
  account: UUID | AccountEntity,
  status: AlertStatus,
}

export type CreateAlertProps<T> = Omit<AlertProps<T>, 'birthDate' | 'disappearDate' | 'type' | 'account' | 'status'> & {
  birthDate: CreateDateVO,
  disappearDate: CreateDateVO,
  info: T,
  type: string | AlertTypeEnum,
  account: string | UUID | AccountEntity,
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
        name: startCase(create.name.trim()),
        description: create.description.trim(),
        birthDate: new DateVO(create.birthDate),
        disappearDate: new DateVO(create.disappearDate),
        location: create.location,
        info: create.info,
        account: typeof create.account === 'string' || create.account instanceof UUID ? UUID.generate(create.account) : create.account,
        status: AlertStatus.Open,
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

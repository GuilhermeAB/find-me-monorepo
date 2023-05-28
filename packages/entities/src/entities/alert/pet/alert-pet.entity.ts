import { AlertEntity, AlertProps, CreateAlertProps } from '../base';
import { AlertPetPolicy } from './alert-pet.policy';

export enum PetType {
  Dog = 'Dog',
  Cat = 'Cat',
  Bird = 'Bird',
}

export interface AlertPetPropsBase {
  petType: PetType,
}

export type AlertPetProps = AlertProps<AlertPetPropsBase>;

export type CreateAlertPetProps = CreateAlertProps<Omit<AlertPetPropsBase, 'petType'> & { petType: string | PetType }>;

export class AlertPetEntity extends AlertEntity<AlertPetPropsBase> {
  public static create(props: CreateAlertPetProps): AlertPetEntity {
    const alert = AlertPetEntity.new(props);
    alert.validate();

    const alertProps = alert.getProps();
    const entity = new AlertPetEntity({
      props: {
        ...alertProps,
        info: {
          petType: alertProps.info.petType as PetType,
        },
      },
    });
    entity.validatePet();

    return entity;
  }

  public validatePet(): void {
    AlertPetPolicy.validate(this.getProps());
  }
}

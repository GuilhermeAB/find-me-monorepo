import { AlertEntity, AlertProps, CreateAlertProps } from '../base';
import { AlertPersonPolicy } from './alert-person.policy';

export interface AlertPersonPropsBase {
  isPCD?: boolean;
}

export type AlertPersonProps = AlertProps<AlertPersonPropsBase>;

export type CreateAlertPersonProps = CreateAlertProps<AlertPersonPropsBase>;

export class AlertPersonEntity extends AlertEntity<AlertPersonPropsBase> {
  public static create(props: CreateAlertPersonProps): AlertPersonEntity {
    const alert = AlertPersonEntity.new(props);
    alert.validate();

    const entityProps = alert.getProps();
    const entity = new AlertPersonEntity({
      props: {
        ...entityProps,
        info: {
          ...entityProps.info,
          isPCD: !!entityProps.info.isPCD,
        },
      },
    });
    entity.validatePerson();

    return entity;
  }

  public validatePerson(): void {
    AlertPersonPolicy.validate(this.getProps());
  }
}

import { Policy } from '../../../base';
import { AlertPetEntityType, PetType } from '.';

export class AlertPetPolicy extends Policy {
  public static validatePetType(value: PetType): void {
    if (!value) {
      Policy.error({ key: 'AlertTypeRequired' });
    }

    if (!Object.values(PetType).includes(value)) {
      Policy.error({ key: 'InvalidAlertType', params: { type: value } });
    }
  }

  public static validate(props: AlertPetEntityType): void {
    AlertPetPolicy.validatePetType(props.info?.petType);
  }
}

import { AlertPersonEntityType } from '.';
import { Policy } from '../../../base';

export class AlertPersonPolicy extends Policy {
  public static validatePDC(value: unknown): void {
    if (value && typeof value !== 'boolean') {
      Policy.error({ key: 'InvalidPDCValue' });
    }
  }

  public static validate(props: AlertPersonEntityType): void {
    AlertPersonPolicy.validatePDC(props.info.isPCD);
  }
}

import { DateVO } from '@find-me/date';
import { Policy } from '../../../base';
import { AlertEntityType, AlertTypeEnum } from '.';

const MIN_AGE = 1;
const MAX_AGE = 116;

const NAME_MIN_LENGTH = 3;
const NAME_MAX_LENGTH = 50;

const DESCRIPTION_MIN_LENGTH = 20;
const DESCRIPTION_MAX_LENGTH = 400;

const NAME_REGEX = /^([A-Z][a-z]+([ ]?[a-z]?['-]?[A-Z][a-z]+)*)$/g;

export class AlertPolicy extends Policy {
  public static validateType(type: AlertTypeEnum): void {
    if (!type) {
      Policy.error({ key: 'AlertTypeRequired' });
    }

    if (!Object.values(AlertTypeEnum).includes(type)) {
      Policy.error({ key: 'InvalidAlertType', params: { type } });
    }
  }

  public static validateAge(birthDate: DateVO): void {
    if (!birthDate) {
      Policy.error({ key: 'BirthDateRequired' });
    }

    if (!Policy.ageIsBetween(birthDate, MIN_AGE, MAX_AGE)) {
      Policy.error({ key: 'BirthDateInvalid' });
    }
  }

  public static validateDisappearDate(disappearDate: DateVO): void {
    if (!disappearDate) {
      Policy.error({ key: 'DisappearDateRequired' });
    }

    if (DateVO.isFuture(disappearDate)) {
      Policy.error({ key: 'DisappearDateInvalid' });
    }
  }

  public static validateName(name: string): void {
    if (!name) {
      Policy.error({ key: 'NameRequired' });
    }

    if (!Policy.lengthIsBetween(name, NAME_MIN_LENGTH, NAME_MAX_LENGTH)) {
      Policy.error({ key: 'NameLength', params: { min: NAME_MIN_LENGTH, max: NAME_MAX_LENGTH } });
    }

    if (!Policy.matchRegex(name, NAME_REGEX)) {
      Policy.error({ key: 'NameInvalid' });
    }
  }

  public static validateLatitude(latitude: unknown): void {
    if (!Policy.isRequired(latitude)) {
      Policy.error({ key: 'LatitudeRequired' });
    }

    if (!Policy.isNumber(Number(latitude))) {
      Policy.error({ key: 'LatitudeInvalid' });
    }

    const value = Number(latitude);
    if (!(value >= -90 && value <= 90)) {
      Policy.error({ key: 'LatitudeInvalid' });
    }
  }

  public static validateLongitude(longitude: unknown): void {
    if (!Policy.isRequired(longitude)) {
      Policy.error({ key: 'LongitudeRequired' });
    }

    if (!Policy.isNumber(Number(longitude))) {
      Policy.error({ key: 'LongitudeInvalid' });
    }

    const value = Number(longitude);
    if (!(value >= -180 && value <= 180)) {
      Policy.error({ key: 'LongitudeInvalid' });
    }
  }

  public static validateDescription(description: string): void {
    if (!Policy.isRequired(description)) {
      Policy.error({ key: 'DescriptionRequired' });
    }

    if (!Policy.lengthIsBetween(description, DESCRIPTION_MIN_LENGTH, DESCRIPTION_MAX_LENGTH)) {
      Policy.error({ key: 'DescriptionLength', params: { min: DESCRIPTION_MIN_LENGTH, max: DESCRIPTION_MAX_LENGTH } });
    }
  }

  public static validate(props: AlertEntityType): void {
    AlertPolicy.validateType(props.type);
    AlertPolicy.validateAge(props.birthDate);
    AlertPolicy.validateDisappearDate(props.disappearDate);
    AlertPolicy.validateName(props.name);
    AlertPolicy.validateDescription(props.description);
    AlertPolicy.validateLatitude(props.location.coordinates[1]);
    AlertPolicy.validateLongitude(props.location.coordinates[0]);
  }
}

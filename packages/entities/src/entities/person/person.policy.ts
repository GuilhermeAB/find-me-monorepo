import { DateVO } from '@find-me/date';
import { Policy } from '../../base';
import { PersonProps } from '.';

const MIN_AGE = 13;
const MAX_AGE = 116;

const NAME_MIN_LENGTH = 3;
const NAME_MAX_LENGTH = 50;

const NAME_REGEX = /^([A-Z][a-z]+([ ]?[a-z]?['-]?[A-Z][a-z]+)*)$/g;

export class PersonPolicy extends Policy {
  public static validateBirthDate(birthDate: DateVO): void {
    if (!birthDate) {
      Policy.error({ key: 'BirthDateRequired' });
    }

    if (!Policy.ageIsBetween(birthDate, MIN_AGE, MAX_AGE)) {
      Policy.error({ key: 'BirthDateMinMax', params: { min: MIN_AGE, max: MAX_AGE } });
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

  public static validate(props: PersonProps): void {
    PersonPolicy.validateBirthDate(props.birthDate);
    PersonPolicy.validateName(props.name);
  }
}

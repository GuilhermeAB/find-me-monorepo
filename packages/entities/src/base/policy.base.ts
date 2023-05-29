import { DateVO } from '@find-me/date';
import { ValidationError, ValidationErrorProps } from '@find-me/errors';

export class Policy {
  protected static matchRegex(value: string, regex: RegExp): boolean {
    return !!value.match(regex);
  }

  protected static isNumber(value: unknown): boolean {
    return typeof value === 'number' && !Number.isNaN(value);
  }

  protected static isRequired(value: unknown): boolean {
    // eslint-disable-next-line eqeqeq
    return value != undefined;
  }

  protected static lengthIsBetween(
    value: number | string,
    min: number,
    max: number,
  ): boolean {
    const valueLength = value.toString().length;

    if (valueLength < min || valueLength > max) {
      return false;
    }
    return true;
  }

  protected static ageIsBetween(date: DateVO | Date, min: number, max: number): boolean {
    const age = DateVO.differenceInYears(DateVO.now(), date);

    if (age < min || age > max) {
      return false;
    }
    return true;
  }

  public static isEnumValue<T>(value: unknown, enumObject: T): boolean {
    const values = Object.values(enumObject as Record<string, string>);

    if (!values.includes(String(value))) {
      return false;
    }
    return true;
  }

  protected static error(error: ValidationErrorProps): void {
    throw new ValidationError(error);
  }
}

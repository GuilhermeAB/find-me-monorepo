import { ValidationError, ValidationErrorProps } from '@find-me/errors';
import { UUID } from '@find-me/uuid';
import { DateVO } from '@find-me/date';

type Optional<T> = T | undefined | null;

export class Guard {
  public static required(value: unknown, error: ValidationErrorProps): void {
    if (!value?.toString()?.length) {
      throw new ValidationError(error);
    }
  }

  public static isUUID(value: Optional<unknown>, isOptional?: boolean): void {
    if (isOptional && value == null) {
      return;
    }

    UUID.generate(String(value));
  }

  public static isDate(value: Optional<unknown>, isOptional?: boolean): void {
    if (isOptional && value == null) {
      return;
    }

    DateVO.generate(String(value));
  }

  public static isString(value: Optional<unknown>, error: ValidationErrorProps, isOptional?: boolean): void {
    if (isOptional && value == null) {
      return;
    }

    if (typeof value !== 'string') {
      throw new ValidationError(error);
    }
  }

  public static stringLength(value: string, options: { min?: number, max?: number }, error: ValidationErrorProps): void {
    const { length } = value;

    if (options.min && length < options.min) {
      throw new ValidationError(error);
    }
    if (options.max && length > options.max) {
      throw new ValidationError(error);
    }
  }

  public static isNumber(value: unknown, error: ValidationErrorProps, isOptional?: boolean): void {
    if (isOptional && value == null) {
      return;
    }

    if (!(typeof value === 'number' && !Number.isNaN(value))) {
      throw new ValidationError(error);
    }
  }

  public static isBoolean(value: unknown, error: ValidationErrorProps, isOptional?: boolean): void {
    if (isOptional && value == null) {
      return;
    }

    if ((!['true', 'false'].some((k) => k === value) && typeof value !== 'boolean')) {
      throw new ValidationError(error);
    }
  }

  public static isEnumValue<T>(value: unknown, enumObject: T, error: ValidationErrorProps): void {
    const values = Object.values(enumObject as Record<string, string>);

    if (!values.includes(String(value))) {
      throw new ValidationError(error);
    }
  }
}

import { ValidationError } from '@find-me/errors';
import {
  differenceInMinutes,
  differenceInYears,
  addHours,
  differenceInDays,
  formatDistance,
  lastDayOfMonth,
  subYears,
  addYears,
  subMinutes,
  isFuture,
  differenceInMilliseconds,
} from 'date-fns';

export interface DateVOProps {
  value: Date;
}

function validateDate(value: unknown): asserts value is Date {
  if (!(value instanceof Date) || Number.isNaN(value?.getTime())) {
    throw new ValidationError({ key: 'InvalidDate' });
  }
}

export type CreateDateVO = string | number | DateVO | Date;

export class DateVO {
  private readonly props: DateVOProps;

  public get value(): Date {
    return this.props.value;
  }

  constructor(value: CreateDateVO) {
    const date = value instanceof DateVO ? value.value : new Date(value);

    this.props = {
      value: date,
    };

    this.validate();
  }

  public static generate(value: CreateDateVO): DateVO {
    if (value instanceof DateVO) {
      return value;
    }

    return new DateVO(value);
  }

  public static now(): DateVO {
    return new DateVO(Date.now());
  }

  private validate(): void {
    validateDate(this.props.value);
  }

  public static validate(value: unknown): asserts value is Date {
    validateDate(value);
  }

  public addHours(value: number): DateVO {
    this.props.value = addHours(this.props.value, value);

    return this;
  }

  public subMinutes(value: number): DateVO {
    this.props.value = subMinutes(this.props.value, value);

    return this;
  }

  public addYears(value: number): DateVO {
    this.props.value = addYears(this.props.value, value);

    return this;
  }

  public subYears(value: number): DateVO {
    this.props.value = subYears(this.props.value, value);

    return this;
  }

  public static isFuture(value: Date | number | DateVO): boolean {
    const date = value instanceof DateVO ? value.value : new Date(value);

    return isFuture(date);
  }

  private static executeDateFunction<T>(dateLeft: Date | number | DateVO, dateRight: Date | number | DateVO, fn: (left: Date, right: Date) => T): T {
    const valueLeft = dateLeft instanceof DateVO ? dateLeft.value : new Date(dateLeft);
    const valueRight = dateRight instanceof DateVO ? dateRight.value : new Date(dateRight);

    return fn(valueLeft, valueRight);
  }

  public static differenceInYears(dateLeft: Date | number | DateVO, dateRight: Date | number | DateVO): number {
    return this.executeDateFunction(dateLeft, dateRight, differenceInYears);
  }

  public static differenceInMinutes(dateLeft: Date | number | DateVO, dateRight: Date | number | DateVO): number {
    return this.executeDateFunction(dateLeft, dateRight, differenceInMinutes);
  }

  public static differenceInMilliseconds(dateLeft: Date | number | DateVO, dateRight: Date | number | DateVO): number {
    return this.executeDateFunction(dateLeft, dateRight, differenceInMilliseconds);
  }

  public static differenceInDays(dateLeft: Date | number | DateVO, dateRight: Date | number | DateVO): number {
    return this.executeDateFunction(dateLeft, dateRight, differenceInDays);
  }

  public static formatDistance(dateLeft: Date | number | DateVO, dateRight: Date | number | DateVO): string {
    return this.executeDateFunction(dateLeft, dateRight, formatDistance);
  }

  public firstDayOfMonth(): Date {
    const { value } = this.props;
    const year = value.getFullYear();
    const month = value.getMonth();

    return new Date(year, month, 1);
  }

  public lastDayOfMonth(): Date {
    return lastDayOfMonth(this.props.value);
  }
}

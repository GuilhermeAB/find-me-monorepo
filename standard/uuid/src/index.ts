import { v4 as uuidV4, validate } from 'uuid';
import { ValidationError } from '@find-me/errors';

export interface UUIDProps {
  value: string,
}

export class UUID {
  private props: UUIDProps;

  public get value(): string {
    return this.props.value;
  }

  constructor(value: string) {
    this.props = {
      value,
    };

    this.validate();
  }

  public static generate(value?: string | UUID): UUID {
    if (value instanceof UUID) {
      return value;
    }

    return new UUID(value || uuidV4());
  }

  private validate(): void {
    if (!validate(this.value)) {
      throw new ValidationError({ key: 'InvalidId' });
    }
  }

  public static validate(value: string): void {
    if (!validate(value)) {
      throw new ValidationError({ key: 'InvalidId' });
    }
  }
}

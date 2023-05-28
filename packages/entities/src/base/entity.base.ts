import { UUID } from '@find-me/uuid';
import { DateVO } from '@find-me/date';

export interface BaseEntityProps {
  id: UUID,
  createdAt?: DateVO,
  updatedAt?: DateVO,
}

export interface CreateBaseEntity {
  id?: UUID | string,
  createdAt?: string | number | DateVO | Date,
  updatedAt?: string | number | DateVO | Date,
}

export interface CreateEntityProps<T> extends CreateBaseEntity {
  props: T,
  timestamps?: boolean,
}

export abstract class Entity<EntityProps> {
  private readonly id: UUID;

  private readonly createdAt?: DateVO;

  private updatedAt?: DateVO;

  protected readonly props: EntityProps;

  constructor({
    id, createdAt, updatedAt, props, timestamps = true,
  }: CreateEntityProps<EntityProps>) {
    this.id = UUID.generate(id);
    if (timestamps) {
      const now = DateVO.now();

      this.createdAt = new DateVO(createdAt || now);
      this.updatedAt = new DateVO(updatedAt || now);
    }
    this.props = props;
  }

  public abstract validate(): void;

  public getProps(): EntityProps & BaseEntityProps {
    const copyProps = {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      ...this.props,
    };

    return Object.freeze(copyProps);
  }

  private resolveFlatPropsValues(value: unknown, omit?: string[]): unknown {
    if (value instanceof UUID || value instanceof DateVO) {
      return value.value;
    }
    if (value instanceof Entity) {
      return this.resolveFlatProps(value, omit);
    }
    if (Array.isArray(value)) {
      return value.map((item: unknown) => this.resolveFlatPropsValues(item, omit));
    }
    if (value && typeof value === 'object' && Object.keys(value).length) {
      const objectValue: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(value)) {
        if (!omit?.includes(key)) {
          objectValue[key] = this.resolveFlatPropsValues(val, omit);
        }
      }

      return objectValue;
    }

    return value;
  }

  private resolveFlatProps(entity: Entity<unknown>, omit?: string[]): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    Object.entries(entity.getProps()).forEach(([key, value]) => {
      if (!omit?.includes(key)) {
        result[key] = this.resolveFlatPropsValues(value, omit);
      }
    });

    return result;
  }

  public getFlatProps(omit?: string[]): Readonly<Record<string, unknown>> {
    return Object.freeze(this.resolveFlatProps(this, omit));
  }
}

import { DateVO } from '@find-me/date';
import { CreateEntityProps, Entity } from '@find-me/entities';
import { UUID } from '@find-me/uuid';

export interface EntityProps<T> {
  id: UUID | string,
  props: T,
  createdAt?: DateVO | Date,
  updatedAt?: DateVO | Date,
  timestamps?: boolean,
}

export abstract class Mapper<T extends Entity<unknown>, DTOEntityType> {
  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private EntityConstructor: new (props: CreateEntityProps<any>) => T,
  ) {}

  protected abstract toDomainProps(databaseEntity: DTOEntityType): EntityProps<unknown>;

  private static isUUID(value: unknown): value is UUID {
    return value instanceof UUID;
  }

  private static isDateVO(value: unknown): value is DateVO {
    return value instanceof DateVO;
  }

  private static isEntity(value: unknown): value is Entity<unknown> {
    return value instanceof Entity;
  }

  public toEntity(entity: DTOEntityType & { _id: string }): T {
    const {
      props,
      createdAt,
      updatedAt,
      timestamps,
    } = this.toDomainProps(entity);

    return new this.EntityConstructor({
      id: entity._id,
      props,
      createdAt,
      updatedAt,
      timestamps: !!(timestamps || (createdAt && updatedAt)),
    });
  }

  public toEntities(entities: Array<DTOEntityType & { _id: string }>): T[] {
    return entities.map((entity) => this.toEntity(entity));
  }

  private getDatabaseEntityValue(value: unknown): unknown {
    if (Mapper.isUUID(value) || Mapper.isDateVO(value)) {
      return value.value;
    }

    if (Mapper.isEntity(value)) {
      return this.getDatabaseEntityValue(value.getProps().id.value);
    }

    if (Array.isArray(value) && value.every((i) => Mapper.isEntity(i))) {
      return value.map((item: Entity<unknown>) => this.toDatabaseEntity(item));
    }

    if (Array.isArray(value)) {
      return value.map((item: unknown) => this.getDatabaseEntityValue(item));
    }

    if (value && typeof value === 'object') {
      const result: Record<string, unknown> = {};

      Object.entries(value).forEach(([key, v]) => {
        if (key === 'id' && Mapper.isUUID(v)) {
          result._id = v.value;
        } else {
          result[key] = this.getDatabaseEntityValue(v);
        }
      });

      return result;
    }

    return value;
  }

  public toDatabaseEntity(entity: Entity<unknown>): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    Object.entries(entity.getProps()).forEach(([key, value]) => {
      if (key === 'id' && Mapper.isUUID(value)) {
        result._id = value.value;
      } else {
        result[key] = this.getDatabaseEntityValue(value);
      }
    });

    return result;
  }
}

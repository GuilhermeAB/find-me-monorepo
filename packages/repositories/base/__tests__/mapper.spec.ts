import { DateVO } from '@find-me/date';
import { Entity } from '@find-me/entities';
import { UUID } from '@find-me/uuid';

import { EntityProps, Mapper } from '../mapper';

class SampleEntity extends Entity<{ name: string }> {
  public getName(): string {
    return this.props.name;
  }

  public validate(): void {
  }
}

class SampleMapper extends Mapper<SampleEntity, Record<string, unknown>> {
  protected toDomainProps(entity: Record<string, unknown>): EntityProps<{ name: string }> {
    const { name } = entity as { name: unknown };

    return {
      id: new UUID('c320efa4-23b5-45d3-a9dc-6eaaccca9776'),
      props: { name: name as string },
      createdAt: new DateVO('2022-01-01T00:00:00.000Z'),
      updatedAt: new DateVO('2022-01-01T00:00:00.000Z'),
      timestamps: true,
    };
  }
}

describe('SampleMapper', () => {
  const sampleMapper = new SampleMapper(SampleEntity);
  
  describe('toEntity', () => {
    it('should return a new instance of the entity with correct values', () => {
      const databaseEntity = {
        _id: UUID.generate().value,
        name: 'John Doe',
      };
      
      const result = sampleMapper.toEntity(databaseEntity);

      expect(result).toBeInstanceOf(SampleEntity);
      expect(result.getProps().id.value).toEqual(databaseEntity._id);
      expect(result.getName()).toEqual('John Doe');
      expect(result.getProps().createdAt?.value).toEqual(new Date('2022-01-01T00:00:00.000Z'));
      expect(result.getProps().updatedAt?.value).toEqual(new Date('2022-01-01T00:00:00.000Z'));
    });
  });

  describe('toEntities', () => {
    it('should return an array of new instances of the entity with correct values', () => {
      const databaseEntity1 = {
        _id: UUID.generate().value,
        name: 'John Doe',
      };
      const databaseEntity2 = {
        _id: UUID.generate().value,
        name: 'Jane Doe',
      };
      
      const result = sampleMapper.toEntities([databaseEntity1, databaseEntity2]);

      expect(result).toHaveLength(2);

      expect(result[0]).toBeInstanceOf(SampleEntity);
      expect(result[0].getProps().id.value).toEqual(databaseEntity1._id);
      expect(result[0].getName()).toEqual('John Doe');
      expect(result[0].getProps().createdAt?.value).toEqual(new Date('2022-01-01T00:00:00.000Z'));
      expect(result[0].getProps().updatedAt?.value).toEqual(new Date('2022-01-01T00:00:00.000Z'));

      expect(result[1]).toBeInstanceOf(SampleEntity);
      expect(result[1].getProps().id.value).toEqual(databaseEntity2._id);
      expect(result[1].getName()).toEqual('Jane Doe');
      expect(result[1].getProps().createdAt?.value).toEqual(new Date('2022-01-01T00:00:00.000Z'));
      expect(result[1].getProps().updatedAt?.value).toEqual(new Date('2022-01-01T00:00:00.000Z'));
    });
  });

  describe('toDatabaseEntity', () => {
    it('should return an object with correct values to store in the database', () => {
      const sampleEntity = new SampleEntity({
        id: new UUID('c320efa4-23b5-45d3-a9dc-6eaaccca9776'),
        props: { name: 'John Doe' },
        createdAt: new DateVO('2022-01-01T00:00:00.000Z'),
        updatedAt: new DateVO('2022-01-02T00:00:00.000Z'),
        timestamps: true,
      });
      
      const result = sampleMapper.toDatabaseEntity(sampleEntity);

      expect(result).toEqual({
        _id: 'c320efa4-23b5-45d3-a9dc-6eaaccca9776',
        name: 'John Doe',
        createdAt: new Date('2022-01-01T00:00:00.000Z'),
        updatedAt: new Date('2022-01-02T00:00:00.000Z'),
      });
    });
  });
});

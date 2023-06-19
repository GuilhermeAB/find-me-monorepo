import { Repository } from '../repository';
import { Entity } from '@find-me/entities/src/base';
import { DTO, DTOModel, Session } from '@find-me/database';
import { EntityProps, Mapper } from '../mapper';
import { DateVO } from '@find-me/date';
import { UUID } from '@find-me/uuid';

interface TestEntity {
  name: string;
}

type DTOSampleType = Omit<TestEntity, 'id'> & { _id: string };

class SampleEntity extends Entity<{ name: string }> {
  public getName(): string {
    return this.props.name;
  }

  public validate(): void {
  }
}

class SampleMapper extends Mapper<SampleEntity, TestEntity> {
  protected toDomainProps(entity: TestEntity): EntityProps<{ name: string }> {
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

class SampleDTO extends DTO<DTOSampleType> {
  public static create(): SampleDTO {
    const schema = new SampleDTO({
      name: 'Sample',
      schema: {
        _id: String,
        name: String,
      },
      options: {
        timestamps: true,
      }
    });

    return schema;
  }
}

const DTOSample = SampleDTO.create();


class TestRepository extends Repository<DTOSampleType, SampleEntity> {
  protected mapper = new SampleMapper(SampleEntity);

  protected Model = DTOSample.model;
}

describe('TestRepository', () => {
  describe('create', () => {
    it('should create a new entity and return the created entity', async () => {
      // Arrange
      const mockSession = {
        transaction: jest.fn(),
      };
      const mockMapper = {
        toDatabaseEntity: jest.fn((entity) => ({ ...entity })),
        toEntity: jest.fn((dto) => ({ ...dto })),
      };
      const mockResult = {
        save: jest.fn(() => Promise.resolve({ toObject: jest.fn(() => ({ id: '123', value: 'test' })) })),
        toObject: jest.fn(() => ({ id: '123', value: 'test' })),
      };
      const MockModel = jest.fn(() => mockResult);

      const repository = new TestRepository(mockSession as unknown as Session);

      repository.mapper = mockMapper as unknown as Mapper<Entity<unknown>, TestEntity>;
      repository.Model = MockModel as unknown as DTOModel<TestEntity>;

      const testEntity = new SampleEntity({ props: { name: '' } })

      // Act
      const createdEntity = await repository.create(testEntity);

      // Assert
      expect(createdEntity).toEqual({ id: '123', value: 'test' });
      expect(mockResult.save).toHaveBeenCalledWith({ session: mockSession });
      expect(mockMapper.toDatabaseEntity).toHaveBeenCalledWith(testEntity);
      expect(mockMapper.toEntity).toHaveBeenCalledWith({ id: '123', value: 'test' });
    });
  });

  describe('findOneById', () => {
    it('should find an entity by id and return it', async () => {
      // Arrange
      const mockSession = {
        transaction: jest.fn(),
      };
      const mockMapper = {
        toEntity: jest.fn((dto) => ({ ...dto })),
      };

      const mockFindOne = jest.fn(() => ({ exec: jest.fn(() => Promise.resolve({ id: '123', value: 'test' })) }));
      const MockModel = { findOne: mockFindOne };

      const repository = new TestRepository(mockSession as unknown as Session);

      // @ts-ignore
      repository.mapper = mockMapper as unknown as Mapper<Entity<unknown>, TestEntity>;
      // @ts-ignore
      repository.Model = MockModel as unknown as DTOModel<TestEntity>;

      const testId = '123';
      // Act
      const foundEntity = await repository.findOneById(testId);

      // Assert
      expect(foundEntity).toEqual({ id: '123', value: 'test' });
      expect(mockFindOne).toHaveBeenCalledWith(
        {
          _id: testId,
        },
        undefined,
        {
          session: mockSession,
          lean: true,
        },
      );
      expect(mockMapper.toEntity).toHaveBeenCalledTimes(1)
    });

    it('should return undefined if the entity is not found', async () => {
      // Arrange
      const mockSession = {
        transaction: jest.fn(),
      };
      const mockMapper = {
        toEntity: jest.fn((dto) => ({ ...dto })),
      };

      const mockFindOne = jest.fn(() => ({ exec: jest.fn(() => Promise.resolve(undefined)) }));
      const MockModel = { findOne: mockFindOne };

      const repository = new TestRepository(mockSession as unknown as Session);

      // @ts-ignore
      repository.mapper = mockMapper as unknown as Mapper<Entity<unknown>, TestEntity>;
      // @ts-ignore
      repository.Model = MockModel as unknown as DTOModel<TestEntity>;

      const testId = '123';
      // Act
      const foundEntity = await repository.findOneById(testId);

      // Assert
      expect(foundEntity).toBeUndefined();
      expect(mockFindOne).toHaveBeenCalledWith(
        {
          _id: testId,
        },
        undefined,
        {
          session: mockSession,
          lean: true,
        },
      );
      expect(mockMapper.toEntity).not.toHaveBeenCalled();
    });
  });

  describe('createMany', () => {
    it('should create many entities', async () => {
      // Arrange
      const mockSession = {
        transaction: jest.fn(),
      };
      const mockMapper = {
        toDatabaseEntity: jest.fn((dto) => ({ ...dto })),
      };

      const insertMany = jest.fn();
      const MockModel = { insertMany };

      const repository = new TestRepository(mockSession as unknown as Session);

      // @ts-ignore
      repository.mapper = mockMapper as unknown as Mapper<Entity<unknown>, TestEntity>;
      // @ts-ignore
      repository.Model = MockModel as unknown as DTOModel<TestEntity>;

      await repository.createMany([new SampleEntity({ props: { name: '' }})]);

      expect(insertMany).toHaveBeenCalledTimes(1);
    })
  })
});

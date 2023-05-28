import { Entity } from '@find-me/entities/src/base';
import { DTOModel, Session } from '@find-me/database';
import { Mapper } from './mapper';

export abstract class Repository<DTOEntityType, T extends Entity<unknown>> {
  protected abstract mapper: Mapper<T, DTOEntityType>;

  protected abstract Model: DTOModel<DTOEntityType>;

  protected session?: Session;

  constructor(session?: Session) {
    this.session = session;
  }

  public async create(entity: T): Promise<T> {
    const result = new this.Model(this.mapper.toDatabaseEntity(entity));
    await result.save({
      session: this.session,
    });

    return this.mapper.toEntity(result.toObject());
  }

  public async createMany(entities: T[]): Promise<void> {
    await this.Model.insertMany(entities.map((entity) => this.mapper.toDatabaseEntity(entity)));
  }

  public async find(): Promise<T[] | undefined> {
    const result = await this.Model.find(
      {},
      undefined,
      {
        session: this.session,
        lean: true,
      },
    ).exec();

    return result ? this.mapper.toEntities(result as Array<DTOEntityType & { _id: string }>) : undefined;
  }

  public async findFlat(): Promise<unknown[] | undefined> {
    const result = await this.Model.find(
      {},
      undefined,
      {
        session: this.session,
        lean: true,
      },
    ).exec();

    if (result) {
      const list = this.mapper.toEntities(result as Array<DTOEntityType & { _id: string }>);

      return list.map((item) => item.getFlatProps());
    }

    return undefined;
  }

  public async findOneById(id: string): Promise<T | undefined> {
    const result = await this.Model.findOne(
      {
        _id: id,
      },
      undefined,
      {
        session: this.session,
        lean: true,
      },
    ).exec();

    return result ? this.mapper.toEntity(result as DTOEntityType & { _id: string }) : undefined;
  }

  public async exists(id: string): Promise<boolean> {
    const result = await this.Model.findOne(
      {
        _id: id,
      },
      undefined,
      {
        session: this.session,
      },
    ).exec();

    return !!result;
  }
}

import { AlertEntity, AlertLocationType } from '@find-me/entities';
import { Repository } from '@find-me/repositories/base/repository';
import { DTOAlert, DTOAlertType } from '@find-me/repositories/schema/alert';
import { AlertMapper } from './mapper';

export class AlertRepository extends Repository<DTOAlertType, AlertEntity<unknown>> {
  protected Model = DTOAlert.model;

  protected mapper = new AlertMapper(AlertEntity);

  public async updateOne(entity: AlertEntity<unknown>): Promise<void> {
    const {
      id,
      name,
      description,
      birthDate,
      disappearDate,
      location,
      info,
    } = entity.getProps();

    await this.Model.updateOne(
      {
        _id: id.value,
      },
      {
        $set: {
          name,
          description,
          birthDate: birthDate.value,
          disappearDate: disappearDate.value,
          location,
          info,
        },
      },
      {
        session: this.session,
      },
    ).exec();
  }

  public async getNearby(latitude: number, longitude: number, type?: string): Promise<unknown[] | undefined> {
    let filter: Record<string, unknown> = {
      location: {
        $near: {
          $geometry: {
            type: AlertLocationType.Point,
            coordinates: [longitude, latitude],
          },
          $minDistance: 0,
          $maxDistance: 15000,
        },
      },
    };

    if (type) {
      filter = {
        ...filter,
        type: {
          $eq: type,
        },
      };
    }

    const result = await this.Model.find(
      filter,
      undefined,
      {
        session: this.session,
        lean: true,
      },
    )
      .limit(100)
      .exec();

    const list = result && result.length ? this.mapper.toEntities(result) : undefined;

    if (list) {
      return list.map((item) => item.getFlatProps());
    }

    return undefined;
  }
}

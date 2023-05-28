import { AlertImageEntity } from '@find-me/entities';
import { Repository } from '@find-me/repositories/base/repository';
import { DTOAlertImage, DTOAlertImageType } from '@find-me/repositories/schema/alert-image';
import { AlertImageMapper } from './mapper';

export class AlertImageRepository extends Repository<DTOAlertImageType, AlertImageEntity> {
  protected Model = DTOAlertImage.model;

  protected mapper = new AlertImageMapper(AlertImageEntity);

  public async getByAlertId(alert: string): Promise<AlertImageEntity | undefined> {
    const result = await this.Model.findOne(
      {
        alert,
      },
      undefined,
      {
        session: this.session,
        lean: true,
      },
    ).exec();

    return result ? this.mapper.toEntity(result) : undefined;
  }

  public async updateOne(entity: AlertImageEntity): Promise<void> {
    const {
      id,
      height,
      width,
      size,
      type,
    } = entity.getProps();

    await this.Model.updateOne(
      {
        _id: id.value,
      },
      {
        $set: {
          type,
          width,
          height,
          size,
        },
      },
      {
        session: this.session,
      },
    ).exec();
  }
}

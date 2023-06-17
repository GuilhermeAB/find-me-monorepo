import {
  AlertImageEntity,
  AlertPersonEntity,
  AlertPersonPropsBase,
  AlertPetEntity,
  AlertPetPropsBase,
  AlertTypeEnum,
  CreateAlertPersonProps,
  CreateAlertPetProps,
} from '@find-me/entities';
import { UUID } from '@find-me/uuid';
import { ImageHandler } from '@find-me/images';
import { ValidationError } from '@find-me/errors';
import { AlertService } from '../base';

export class AlertUpdateService extends AlertService {
  private async updateImage(alertId: UUID, image: Buffer): Promise<void> {
    const {
      AWS_BUCKET_IMAGE,
    } = process.env;

    if (!AWS_BUCKET_IMAGE) {
      throw new ValidationError({ key: 'InvalidEnv' });
    }

    const current = await this.repositoryImage.getByAlertId(alertId.value);
    if (!current) {
      throw new ValidationError({ key: 'ImageNotFound' });
    }

    const handler = new ImageHandler(image);
    await handler.toWebp();
    const metadata = await handler.metadata();

    const entity = AlertImageEntity.create(
      {
        alert: alertId,
        height: metadata.height!,
        width: metadata.width!,
        size: metadata.size!, // Total size of image in KB
        type: metadata.format!,
      },
      current.getProps().id,
    );
    entity.validate(2048);

    const props = entity.getProps();

    await this.repositoryImage.updateOne(entity);

    const key = `${alertId.value}/${props.id.value}`;
    await this.storage.delete(AWS_BUCKET_IMAGE, `${key}.${current.getProps().type}`);
    await this.storage.upload(AWS_BUCKET_IMAGE, `${key}.${props.type}`, handler.image());
  }

  public async update(alertId: string, props: Omit<CreateAlertPersonProps | CreateAlertPetProps, 'type'>, image?: Buffer): Promise<void> {
    const alert = await this.repository.findOneById(alertId);
    if (!alert) {
      throw new ValidationError({ key: 'AlertNotFound' });
    }

    const { account } = alert.getProps();
    const accountId = account instanceof UUID || typeof account === 'string' ? UUID.generate(account).value : account.getProps().id.value;
    if (props.account !== accountId) {
      throw new ValidationError({ key: 'AlertNotFound' });
    }

    alert.name = props.name;
    alert.description = props.description;
    alert.birthDate = props.birthDate;
    alert.disappearDate = props.disappearDate;
    alert.location = props.location;
    alert.info = props.info;

    const {
      id,
      type,
      name,
      description,
      birthDate,
      disappearDate,
      location,
      info,
    } = alert.getProps();

    if (type === AlertTypeEnum.Person) {
      AlertPersonEntity.create({
        type,
        name,
        description,
        birthDate,
        disappearDate,
        location,
        info: info as AlertPersonPropsBase,
        account: accountId,
      });
    } else {
      AlertPetEntity.create({
        type,
        name,
        description,
        birthDate,
        disappearDate,
        location,
        info: info as AlertPetPropsBase,
        account: accountId,
      });
    }

    await this.repository.updateOne(alert);

    if (image) {
      await this.updateImage(id, image);
    }
  }

  public async updateStatus(alertId: string, accountIdentifier: string, status: string): Promise<void> {
    const alert = await this.repository.findOneById(alertId);
    if (!alert) {
      throw new ValidationError({ key: 'AlertNotFound' });
    }

    const { account } = alert.getProps();
    const accountId = account instanceof UUID || typeof account === 'string' ? UUID.generate(account).value : account.getProps().id.value;
    if (accountIdentifier !== accountId) {
      throw new ValidationError({ key: 'AlertNotFound' });
    }

    await this.repository.updateStatus(alertId, status);
  }
}

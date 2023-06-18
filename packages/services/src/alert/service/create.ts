import {
  AlertImageEntity,
  AlertPersonEntity,
  AlertPetEntity,
  AlertTypeEnum,
  CreateAlertPersonProps,
  CreateAlertPetProps,
} from '@find-me/entities';
import { UUID } from '@find-me/uuid';
import { ImageHandler } from '@find-me/images';
import { ValidationError } from '@find-me/errors';
import { AlertService } from '../base';

const MAX_ALERTS_PER_USER = 6;
const MAX_ALERTS_OPEN_PER_USER = 3;

export class AlertCreateService extends AlertService {
  private async createImage(alertId: UUID, image: Buffer): Promise<void> {
    const {
      AWS_BUCKET_IMAGE,
    } = process.env;

    if (!AWS_BUCKET_IMAGE) {
      throw new ValidationError({ key: 'InvalidEnv' });
    }

    const handler = new ImageHandler(image);
    await handler.toWebp();
    const metadata = await handler.metadata();

    const entity = AlertImageEntity.create({
      alert: alertId,
      height: metadata.height!,
      width: metadata.width!,
      size: metadata.size!, // Total size of image in KB
      type: metadata.format!,
    });
    entity.validate(2048);

    const props = entity.getProps();

    await this.repositoryImage.create(entity);
    await this.storage.upload(AWS_BUCKET_IMAGE, `${alertId.value}/${props.id.value}.${props.type}`, handler.image());
  }

  public async create(props: CreateAlertPersonProps | CreateAlertPetProps, image: Buffer): Promise<void> {
    let entity;
    if (props.type === AlertTypeEnum.Person) {
      entity = AlertPersonEntity.create(props as CreateAlertPersonProps);
    } else {
      entity = AlertPetEntity.create(props as CreateAlertPetProps);
    }

    entity.validate();
    const {
      account,
    } = entity.getProps();

    const { total, open } = await this.repository.countByAccount(account instanceof UUID ? account.value : account.getProps().id.value);
    if (total >= MAX_ALERTS_PER_USER) {
      throw new ValidationError({ key: 'MaxAlertsCreated', params: { value: MAX_ALERTS_PER_USER } });
    }
    if (open >= MAX_ALERTS_OPEN_PER_USER) {
      throw new ValidationError({ key: 'MaxAlertsOpen', params: { value: MAX_ALERTS_OPEN_PER_USER } });
    }

    await this.repository.create(entity);

    await this.createImage(entity.getProps().id, image);
  }
}

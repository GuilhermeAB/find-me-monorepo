import { AlertImageEntity, AlertImageProps } from '@find-me/entities';
import { EntityProps, Mapper } from '@find-me/repositories/base/mapper';
import { DTOAlertImageType } from '@find-me/repositories/schema/alert-image';

export class AlertImageMapper extends Mapper<AlertImageEntity, DTOAlertImageType> {
  protected toDomainProps(entity: DTOAlertImageType): EntityProps<AlertImageProps> {
    const {
      _id: id,
      createdAt,
      updatedAt,
      ...props
    } = entity;

    return {
      id,
      createdAt,
      updatedAt,
      props,
    };
  }
}

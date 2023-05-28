import {
  AlertEntity, AlertPersonPropsBase, AlertPetPropsBase, AlertProps,
} from '@find-me/entities';
import { EntityProps, Mapper } from '@find-me/repositories/base/mapper';
import { DTOAlertType } from '@find-me/repositories/schema/alert';

export class AlertMapper extends Mapper<AlertEntity<AlertPersonPropsBase | AlertPetPropsBase>, DTOAlertType> {
  protected toDomainProps(entity: DTOAlertType): EntityProps<AlertProps<unknown>> {
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

import { UUID } from '@find-me/uuid';
import { CreateImageProps, ImageEntity } from '../image';

export interface AlertImageProps {
  alert: UUID | string,
}

export type CreateAlertImageProps = CreateImageProps<AlertImageProps>;

export class AlertImageEntity extends ImageEntity<AlertImageProps> {
  public static create(props: CreateAlertImageProps, id?: UUID): AlertImageEntity {
    const image = AlertImageEntity.new(props, id);
    image.validate();

    const entity = new AlertImageEntity({
      props: {
        ...image.getProps(),
        alert: props.alert,
      },
    });

    return entity;
  }
}

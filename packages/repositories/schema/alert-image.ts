import { DTO } from '@find-me/database/src';
import { AlertImageEntityType } from '@find-me/entities';

export type DTOAlertImageType = Omit<AlertImageEntityType, 'id'> & { _id: string };

class AlertImage extends DTO<DTOAlertImageType> {
  public static create(): AlertImage {
    const schema = new AlertImage({
      name: 'Alert_Image',
      schema: {
        _id: String,
        type: String,
        width: Number,
        height: Number,
        size: Number,
        alert: String,
      },
      options: {
        timestamps: true,
      },
    });

    return schema;
  }
}

export const DTOAlertImage = AlertImage.create();

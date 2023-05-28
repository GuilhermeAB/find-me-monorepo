import { DTO } from '@find-me/database';
import { AlertEntityType } from '@find-me/entities';

export type DTOAlertType = Omit<AlertEntityType, 'id'> & { _id: string };

class Alert extends DTO<DTOAlertType> {
  public static create(): Alert {
    const schema = new Alert({
      name: 'Alert',
      schema: {
        _id: String,
        type: String,
        name: String,
        description: String,
        birthDate: Date,
        disappearDate: Date,
        location: {
          type: { type: String },
          coordinates: { type: [Number], index: true }, // longitude, latitude
        },
        info: {},
      },
      options: {
        timestamps: true,
      },
    }, [{
      location: '2dsphere',
    }]);

    return schema;
  }
}

export const DTOAlert = Alert.create();

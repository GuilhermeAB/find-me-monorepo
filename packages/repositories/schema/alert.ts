import { DTO } from '@find-me/database';
import { AccountEntityType, AlertEntityType, PersonEntityType } from '@find-me/entities';
import { DTOAccount } from './account';

export type DTOAlertType = Omit<AlertEntityType, 'id' | 'account'> & {
  _id: string,
  account: Omit<AccountEntityType, 'id' | 'person'> & {
    _id: string,
    person: Omit<PersonEntityType, 'id'> & { _id: string }
  }
};

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
        account: { type: String, ref: DTOAccount.name },
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

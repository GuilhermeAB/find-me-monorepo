import { DTO } from '@find-me/database';
import { AccountEntityType, PersonEntityType } from '@find-me/entities';
import { DTOPerson } from './person';

export type DTOAccountType = Omit<AccountEntityType, 'id' | 'person'> & {
  _id: string,
  person: Omit<PersonEntityType, 'id'> & { _id: string }
};

class Account extends DTO<DTOAccountType> {
  public static create(): Account {
    const schema = new Account({
      name: 'Account',
      schema: {
        _id: String,
        email: String,
        password: String,
        role: String,
        status: String,
        person: { type: String, ref: DTOPerson.name },
      },
    });

    return schema;
  }
}

export const DTOAccount = Account.create();

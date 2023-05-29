import { DTO } from '@find-me/database';
import { PersonEntityType } from '@find-me/entities';

export type DTOPersonType = Omit<PersonEntityType, 'id'> & { _id: string };

class Person extends DTO<DTOPersonType> {
  public static create(): Person {
    const schema = new Person({
      name: 'Person',
      schema: {
        _id: String,
        name: String,
        birthDate: Date,
      },
    });

    return schema;
  }
}

export const DTOPerson = Person.create();

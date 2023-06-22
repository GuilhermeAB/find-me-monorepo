import { CreateDateVO, DateVO } from '@find-me/date';
import startCase from 'lodash.startcase';
import { Entity } from '../../base';
import { PersonPolicy } from './person.policy';

export interface PersonProps {
  name: string,
  birthDate: DateVO
}

export type CreatePersonProps = Omit<PersonProps, 'birthDate'> & {
  birthDate: CreateDateVO
};

export class PersonEntity extends Entity<PersonProps> {
  public static create(create: CreatePersonProps): PersonEntity {
    const person = new PersonEntity({
      props: {
        name: startCase(create.name.trim()),
        birthDate: new DateVO(create.birthDate),
      },
    });

    person.validate();

    return person;
  }

  public validate(): void {
    PersonPolicy.validate(this.getProps());
  }
}

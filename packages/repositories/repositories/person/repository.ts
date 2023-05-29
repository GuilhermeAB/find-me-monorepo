import { PersonEntity } from '@find-me/entities';
import { Repository } from '@find-me/repositories/base/repository';
import { DTOPerson, DTOPersonType } from '@find-me/repositories/schema/person';
import { PersonMapper } from './mapper';

export class PersonRepository extends Repository<DTOPersonType, PersonEntity> {
  protected Model = DTOPerson.model;

  protected mapper = new PersonMapper(PersonEntity);

  public async updateOne(entity: PersonEntity): Promise<void> {
    const {
      id,
      birthDate,
      name,
    } = entity.getProps();

    await this.Model.updateOne(
      {
        _id: id.value,
      },
      {
        $set: {
          name,
          birthDate: birthDate.value,
        },
      },
      {
        session: this.session,
      },
    ).exec();
  }
}

import { AccountEntity, AccountProps, PersonEntity } from '@find-me/entities';
import { EntityProps, Mapper } from '@find-me/repositories/base/mapper';
import { DTOAccountType } from '@find-me/repositories/schema/account';
import { UUID } from '@find-me/uuid';
import { PersonMapper } from '../person/mapper';

export class AccountMapper extends Mapper<AccountEntity, DTOAccountType> {
  protected toDomainProps(entity: DTOAccountType): EntityProps<AccountProps> {
    const personMapper = new PersonMapper(PersonEntity);

    const {
      _id: id,
      createdAt,
      updatedAt,
      person,
      ...props
    } = entity;

    return {
      id,
      createdAt,
      updatedAt,
      props: {
        ...props,
        person: person instanceof UUID ? person : personMapper.toEntity(person),
      },
    };
  }
}

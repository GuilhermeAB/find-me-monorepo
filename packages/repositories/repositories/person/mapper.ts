import { PersonEntity, PersonProps } from '@find-me/entities';
import { EntityProps, Mapper } from '@find-me/repositories/base/mapper';
import { DTOPersonType } from '@find-me/repositories/schema/person';

export class PersonMapper extends Mapper<PersonEntity, DTOPersonType> {
  protected toDomainProps(entity: DTOPersonType): EntityProps<PersonProps> {
    const {
      _id: id,
      ...props
    } = entity;

    return {
      id,
      props,
    };
  }
}

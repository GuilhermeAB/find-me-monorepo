import { AccountDetailsEntity, AccountDetailsProps } from '@find-me/entities';
import { EntityProps, Mapper } from '@find-me/repositories/base/mapper';
import { DTOAccountDetailsType } from '@find-me/repositories/schema/account-details';

export class AccountDetailsMapper extends Mapper<AccountDetailsEntity, DTOAccountDetailsType> {
  protected toDomainProps(entity: DTOAccountDetailsType): EntityProps<AccountDetailsProps> {
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

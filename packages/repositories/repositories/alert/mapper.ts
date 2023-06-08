import {
  AccountEntity,
  AlertEntity, AlertPersonPropsBase, AlertPetPropsBase, AlertProps,
} from '@find-me/entities';
import { EntityProps, Mapper } from '@find-me/repositories/base/mapper';
import { DTOAlertType } from '@find-me/repositories/schema/alert';
import { UUID } from '@find-me/uuid';
import { AccountMapper } from '../account/mapper';

export class AlertMapper extends Mapper<AlertEntity<AlertPersonPropsBase | AlertPetPropsBase>, DTOAlertType> {
  protected toDomainProps(entity: DTOAlertType): EntityProps<AlertProps<unknown>> {
    const accountMapper = new AccountMapper(AccountEntity);

    const {
      _id: id,
      createdAt,
      updatedAt,
      account,
      ...props
    } = entity;

    return {
      id,
      createdAt,
      updatedAt,
      props: {
        ...props,
        account: account instanceof UUID || typeof account === 'string' ? account : accountMapper.toEntity(account),
      },
    };
  }
}

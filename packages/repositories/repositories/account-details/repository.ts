import { AccountDetailsEntity } from '@find-me/entities';
import { Repository } from '@find-me/repositories/base/repository';
import { DTOAccountDetails, DTOAccountDetailsType } from '@find-me/repositories/schema/account-details';
import { AccountDetailsMapper } from './mapper';

export class AccountDetailsRepository extends Repository<DTOAccountDetailsType, AccountDetailsEntity> {
  protected Model = DTOAccountDetails.model;

  protected mapper = new AccountDetailsMapper(AccountDetailsEntity);

  public async getByAccount(id: string): Promise<AccountDetailsEntity | undefined> {
    const result = await this.Model.findOne(
      {
        account: id,
      },
    ).exec();

    return result ? this.mapper.toEntity(result) : undefined;
  }
}

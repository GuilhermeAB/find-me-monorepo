import { AccountEntity, AccountStatus } from '@find-me/entities';
import { Repository } from '@find-me/repositories/base/repository';
import { DTOAccount, DTOAccountType } from '@find-me/repositories/schema/account';
import { AccountMapper } from './mapper';

export class AccountRepository extends Repository<DTOAccountType, AccountEntity> {
  protected Model = DTOAccount.model;

  protected mapper = new AccountMapper(AccountEntity);

  public async emailExists(email: string): Promise<boolean> {
    const result = await this.Model.exists({
      email,
    }).exec();

    return !!result;
  }

  public async findByEmail(email: string): Promise<AccountEntity | undefined> {
    const result = await this.Model.findOne(
      {
        email,
      },
      undefined,
      {
        session: this.session,
        lean: true,
      },
    )
      .populate('person')
      .exec();

    return result ? this.mapper.toEntity(result) : undefined;
  }

  public async findByAccount(id: string): Promise<AccountEntity | undefined> {
    const result = await this.Model.findById(
      {
        _id: id,
      },
      undefined,
      {
        lean: true,
      },
    )
      .populate('person')
      .exec();

    return result ? this.mapper.toEntity(result) : undefined;
  }

  public async updatePassword(entity: AccountEntity): Promise<void> {
    const {
      id,
      password,
    } = entity.getProps();

    await this.Model.updateOne(
      {
        _id: id.value,
      },
      {
        $set: {
          password,
        },
      },
      {
        session: this.session,
      },
    ).exec();
  }

  public async updateStatus(id: string, status: AccountStatus): Promise<void> {
    await this.Model.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          status,
        },
      },
      {
        session: this.session,
      },
    ).exec();
  }
}

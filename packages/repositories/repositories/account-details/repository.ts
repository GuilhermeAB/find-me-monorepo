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
      undefined,
      {
        lean: true,
      },
    ).exec();

    return result ? this.mapper.toEntity(result) : undefined;
  }

  public async increaseFailedSignIn(id: string): Promise<void> {
    await this.Model.updateOne(
      {
        _id: id,
      },
      {
        $inc: {
          failedSignInAttempts: 1,
        },
        $set: {
          lastFailedSignInAttempt: Date.now(),
        },
      },
    ).exec();
  }

  public async saveLastSignIn(id: string): Promise<void> {
    await this.Model.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          lastSignInAt: Date.now(),
        },
        $unset: {
          failedSignInAttempts: 0,
          lastFailedSignInAttempt: null,
        },
      },
      {
        session: this.session,
      },
    ).exec();
  }

  public async increaseFailedActivationAttempts(id: string): Promise<void> {
    await this.Model.updateOne(
      {
        _id: id,
      },
      {
        $inc: {
          failedActivationAttempts: 1,
        },
      },
    ).exec();
  }

  public async activate(id: string): Promise<void> {
    await this.Model.updateOne(
      {
        _id: id,
      },
      {
        $unset: {
          failedActivationAttempts: 0,
          activationCode: null,
          activationCodeCreatedAt: null,
        },
      },
      {
        session: this.session,
      },
    );
  }

  public async changeActivationCode(id: string, code: string): Promise<void> {
    await this.Model.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          failedActivationAttempts: 0,
          activationCode: code,
          activationCodeCreatedAt: new Date(),
        },
      },
      {
        session: this.session,
      },
    );
  }

  public async changePasswordRecoverCode(id: string, code: string): Promise<void> {
    await this.Model.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          recoverCode: code,
          recoverCodeCreatedAt: new Date(),
          failedRecoverAttempts: 0,
        },
      },
      {
        session: this.session,
      },
    );
  }

  public async increaseFailedPasswordRecover(id: string): Promise<void> {
    await this.Model.updateOne(
      {
        _id: id,
      },
      {
        $inc: {
          failedRecoverAttempts: 1,
        },
      },
    ).exec();
  }

  public async resetFailedPasswordRecover(id: string): Promise<void> {
    await this.Model.updateOne(
      {
        _id: id,
      },
      {
        $unset: {
          failedRecoverAttempts: 0,
          recoverCode: null,
          recoverCodeCreatedAt: null,
        },
      },
      {
        session: this.session,
      },
    ).exec();
  }
}

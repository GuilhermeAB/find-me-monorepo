import { DTO } from '@find-me/database';
import { AccountDetailsEntityType } from '@find-me/entities';
import { DTOAccount } from './account';

export type DTOAccountDetailsType = Omit<AccountDetailsEntityType, 'id'> & { _id: string };

class AccountDetails extends DTO<DTOAccountDetailsType> {
  public static create(): AccountDetails {
    const schema = new AccountDetails({
      name: 'AccountDetails',
      schema: {
        _id: String,
        activationCode: String,
        activationCodeCreatedAt: Date,
        failedActivationAttempts: Number,
        recoverCode: String,
        recoverCodeCreatedAt: Date,
        failedRecoverAttempts: Number,
        lastSignInAt: Date,
        failedSignInAttempts: Number,
        lastFailedSignInAttempt: Number,
        lastFailedPasswordChangeAttempt: Date,
        failedPasswordChangeAttempts: String,
        account: { type: String, ref: DTOAccount.name },
      },
    });

    return schema;
  }
}

export const DTOAccountDetails = AccountDetails.create();

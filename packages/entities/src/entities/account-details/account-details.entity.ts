import { DateVO } from '@find-me/date';
import { UUID } from '@find-me/uuid';
import { Entity } from '../../base';
import { AccountEntity } from '../account/account.entity';

export const RANDOM_CODE_LENGTH = 8;

function generateRandomCode(length: number): string {
  const randomNumbers = Array.from({ length: length - 1 }, () => Math.floor(Math.random() * 10));
  const code = randomNumbers.join('');

  return code;
}

export interface ActivationData {
  activationCode?: string,
  activationCodeCreatedAt?: DateVO,
  failedActivationAttempts?: number,
}

export interface RecoverData {
  recoverCode?: string,
  recoverCodeCreatedAt?: DateVO,
  failedRecoverAttempts?: number,
}

export interface SignInData {
  lastSignInAt?: DateVO,
  failedSignInAttempts?: number,
  lastFailedSignInAttempt?: number,
}

export interface PasswordChangeData {
  lastFailedPasswordChangeAttempt?: DateVO,
  failedPasswordChangeAttempts?: number,
}

export interface AccountDetailsProps extends
  ActivationData,
  RecoverData,
  SignInData,
  PasswordChangeData {
  account: UUID | AccountEntity
}

export type CreateAccountDetailsProps = Omit<AccountDetailsProps, 'account'> & {
  account: string | UUID | AccountEntity
};

export class AccountDetailsEntity extends Entity<AccountDetailsProps> {
  public updateActivationCode(): void {
    const {
      activationCode,
      activationCodeCreatedAt,
      failedActivationAttempts,
    } = AccountDetailsEntity.generateActivationCode();

    this.props.activationCode = activationCode;
    this.props.activationCodeCreatedAt = activationCodeCreatedAt;
    this.props.failedActivationAttempts = failedActivationAttempts;
  }

  public updateRecoverCode(): void {
    this.props.recoverCode = AccountDetailsEntity.generateRandomCode();
    this.props.recoverCodeCreatedAt = DateVO.now();
    this.props.failedRecoverAttempts = 0;
  }

  public setLastSignIn(): void {
    this.props.lastSignInAt = DateVO.now();
    this.props.failedSignInAttempts = 0;
    this.props.lastFailedSignInAttempt = undefined;
  }

  public static create(create: CreateAccountDetailsProps, isNew = true): AccountDetailsEntity {
    const activationData = !isNew ? {
      activationCode: create.activationCode,
      activationCodeCreatedAt: create.activationCodeCreatedAt,
      failedActivationAttempts: create.failedActivationAttempts,
    } : AccountDetailsEntity.generateActivationCode();

    const details = new AccountDetailsEntity({
      props: {
        ...create,
        ...activationData,
        account: typeof create.account === 'string' || create.account instanceof UUID ? UUID.generate(create.account) : create.account,
      },
    });

    return details;
  }

  // eslint-disable-next-line class-methods-use-this
  public validate(): void {
  }

  private static generateRandomCode(): string {
    return generateRandomCode(RANDOM_CODE_LENGTH);
  }

  private static generateActivationCode(): ActivationData {
    return {
      activationCode: AccountDetailsEntity.generateRandomCode(),
      activationCodeCreatedAt: DateVO.now(),
      failedActivationAttempts: 0,
    };
  }
}

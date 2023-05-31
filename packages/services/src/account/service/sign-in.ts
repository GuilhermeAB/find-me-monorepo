import {
  AccountStatus,
  AccountDetailsEntity,
  AccountEntity,
} from '@find-me/entities';
import { ValidationError } from '@find-me/errors';
import { scryptSync } from 'crypto';
import { DateVO } from '@find-me/date';
import { AccountService } from '../base';
import { Authentication } from '../authentication';

const MAX_FAILED_SIGN_IN_ATTEMPTS = 3;

export class AccountSignInService extends AccountService {
  private static validateSignInAttempts(details: AccountDetailsEntity): void {
    const {
      lastFailedSignInAttempt,
      failedSignInAttempts,
    } = details.getProps();

    if (lastFailedSignInAttempt && failedSignInAttempts && failedSignInAttempts > MAX_FAILED_SIGN_IN_ATTEMPTS) {
      const lastFailedSignInAttemptTimeDifference = DateVO.differenceInMinutes(DateVO.now(), lastFailedSignInAttempt);
      const signInDelay = failedSignInAttempts * 0.5;

      if (lastFailedSignInAttemptTimeDifference <= signInDelay) {
        const delay = signInDelay - lastFailedSignInAttemptTimeDifference || 1;
        throw new ValidationError({ key: 'SignInManyFailedAttempts', params: { value: delay } });
      }
    }
  }

  private async validatePassword(id: string, currentPassword: string, inputPassword: string): Promise<void> {
    const [password, salt] = currentPassword.split('.');
    const inputPasswordEncrypted = scryptSync(inputPassword, salt, 128).toString('hex');

    if (inputPasswordEncrypted !== password) {
      await this.detailsRepository.increaseFailedSignIn(id);

      throw new ValidationError({ key: 'InvalidEmailOrPassword' });
    }
  }

  private async validate(account: AccountEntity, password: string): Promise<void> {
    const {
      id,
      status,
      password: currentPassword,
    } = account.getProps();

    if (status === AccountStatus.disabled) {
      throw new ValidationError({ key: 'AccountDisabled' });
    }

    const details = await this.detailsRepository.getByAccount(id.value);
    AccountSignInService.validateSignInAttempts(details!);

    await this.validatePassword(id.value, currentPassword, password);
    await this.detailsRepository.saveLastSignIn(details!.getProps().id.value);
  }

  public async signIn(email: string, password: string): Promise<string> {
    const account = await this.repository.findByEmail(email);
    if (!account) {
      throw new ValidationError({ key: 'InvalidEmailOrPassword' });
    }

    await this.validate(account, password);

    return Authentication.generateToken(account);
  }
}

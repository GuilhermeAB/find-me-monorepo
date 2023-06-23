import { ValidationError } from '@find-me/errors';
import {
  AccountDetailsEntity, AccountEntity, AccountStatus, PersonEntity,
} from '@find-me/entities';
import { DateVO } from '@find-me/date';
import { randomBytes, scryptSync } from 'crypto';
import { AccountService } from '../base';
import { AccountMailer } from '../mailer';

const PASSWORD_SALT = 32;

const PASSWORD_RECOVER_REQUEST_DELAY_MINUTES = 5;
const MAX_FAILED_PASSWORD_CHANGE_ATTEMPTS = 2;
const PASSWORD_RECOVER_CODE_EXPIRATION_MINUTES = 15;

export class AccountPasswordRecoverService extends AccountService {
  private static requestNewCodeValidation(account: AccountEntity, details: AccountDetailsEntity): void {
    const {
      status,
    } = account.getProps();

    if (status === AccountStatus.disabled) {
      throw new ValidationError({ key: 'AccountDisabled' });
    }

    const {
      recoverCodeCreatedAt,
    } = details.getProps();

    if (recoverCodeCreatedAt) {
      const delay = DateVO.differenceInMinutes(DateVO.now(), recoverCodeCreatedAt);

      if (delay <= PASSWORD_RECOVER_REQUEST_DELAY_MINUTES) {
        throw new ValidationError({ key: 'PasswordRecoverRequestManyAttempts', params: { value: (PASSWORD_RECOVER_REQUEST_DELAY_MINUTES - delay) || 1 } });
      }
    }
  }

  public async requestNewCode(email: string): Promise<void> {
    const account = await this.repository.findByEmail(email);
    if (!account) {
      throw new ValidationError({ key: 'AccountNotFound' });
    }
    const {
      id,
      person,
    } = account.getProps();

    const details = await this.detailsRepository.getByAccount(id.value);
    if (!details) {
      throw new ValidationError({ key: 'AccountNotFound' });
    }

    AccountPasswordRecoverService.requestNewCodeValidation(account, details);

    details.updateRecoverCode();
    const {
      id: detailsId,
      recoverCode,
    } = details.getProps();

    await this.detailsRepository.changePasswordRecoverCode(detailsId.value, recoverCode!);

    await AccountMailer.sendRecoverPasswordEmail(email, (person as PersonEntity).getProps().name, recoverCode!);
  }

  // eslint-disable-next-line class-methods-use-this
  private async validatePassword(currentPassword: string, inputPassword: string): Promise<void> {
    const [password, salt] = currentPassword.split('.');
    const inputPasswordEncrypted = scryptSync(inputPassword, salt, 128).toString('hex');

    if (inputPasswordEncrypted === password) {
      throw new ValidationError({ key: 'PasswordChangeSamePasswords' });
    }
  }

  private static encryptPassword(password: string): string {
    const salt = randomBytes(PASSWORD_SALT).toString('hex');
    const encryptedPassword = scryptSync(password, salt, 128).toString('hex');

    return `${encryptedPassword}.${salt}`;
  }

  private async passwordRecoverValidation(details: AccountDetailsEntity, code: string): Promise<void> {
    const {
      id,
      recoverCode,
      recoverCodeCreatedAt,
      failedRecoverAttempts,
    } = details.getProps();

    if (!recoverCodeCreatedAt || !recoverCode) {
      throw new ValidationError({ key: 'AccountNotRequestedRecover' });
    }

    if (failedRecoverAttempts && failedRecoverAttempts > MAX_FAILED_PASSWORD_CHANGE_ATTEMPTS) {
      throw new ValidationError({ key: 'PasswordRecoverMaxAttempts' });
    }

    if (DateVO.differenceInMinutes(DateVO.now(), recoverCodeCreatedAt) >= PASSWORD_RECOVER_CODE_EXPIRATION_MINUTES) {
      throw new ValidationError({ key: 'PasswordRecoverCodeExpired' });
    }

    if (recoverCode !== code) {
      await this.detailsRepository.increaseFailedPasswordRecover(id.value);

      throw new ValidationError({ key: 'PasswordRecoverCodeInvalid' });
    }
  }

  public async passwordRecover(email: string, code: string, newPassword: string): Promise<void> {
    const account = await this.repository.findByEmail(email);
    if (!account) {
      throw new ValidationError({ key: 'AccountNotFound' });
    }

    const {
      id,
      password: currentPassword,
      status,
    } = account.getProps();

    if (status === AccountStatus.disabled) {
      throw new ValidationError({ key: 'AccountDisabled' });
    }

    const details = await this.detailsRepository.getByAccount(id.value);
    if (!details) {
      throw new ValidationError({ key: 'AccountNotFound' });
    }

    await this.passwordRecoverValidation(details, code);

    await this.validatePassword(currentPassword, newPassword);
    account.password = newPassword;
    account.validate();

    const {
      password,
    } = account.getProps();

    const {
      id: detailsId,
    } = details.getProps();

    account.password = AccountPasswordRecoverService.encryptPassword(password);
    await this.repository.updatePassword(account);
    await this.detailsRepository.resetFailedPasswordRecover(detailsId.value);
  }
}

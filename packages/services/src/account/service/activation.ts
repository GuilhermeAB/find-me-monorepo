import { ValidationError } from '@find-me/errors';
import {
  AccountDetailsEntity, AccountEntity, AccountStatus, PersonEntity,
} from '@find-me/entities';
import { DateVO } from '@find-me/date';
import { AccountService } from '../base';
import { AccountMailer } from '../mailer';

const MAX_FAILED_ACTIVATION_ATTEMPTS = 3;
const ACTIVATION_CODE_EXPIRE_INTERVAL = 30;

const ACTIVATION_CODE_REQUEST_DELAY_MINUTES = 4;

export class AccountActivationService extends AccountService {
  private async validateActivation(account: AccountEntity, details: AccountDetailsEntity, code: string): Promise<void> {
    const {
      status,
    } = account.getProps();

    if (status !== AccountStatus.unverified) {
      throw new ValidationError({ key: 'CantActivateAccount', params: { value: status } });
    }

    const {
      id,
      activationCode,
      activationCodeCreatedAt,
      failedActivationAttempts,
    } = details.getProps();

    if (failedActivationAttempts && failedActivationAttempts >= MAX_FAILED_ACTIVATION_ATTEMPTS) {
      throw new ValidationError({ key: 'ManyInvalidActivationAttempts' });
    }

    if (DateVO.differenceInMinutes(DateVO.now(), activationCodeCreatedAt!) >= ACTIVATION_CODE_EXPIRE_INTERVAL) {
      throw new ValidationError({ key: 'ActivationCodeExpired' });
    }

    if (activationCode !== code) {
      await this.detailsRepository.increaseFailedActivationAttempts(id.value);

      throw new ValidationError({ key: 'ActivationCodeInvalid' });
    }
  }

  public async activation(id: string, code: string): Promise<void> {
    const account = await this.repository.findByAccount(id);
    const details = await this.detailsRepository.getByAccount(account!.getProps().id.value);
    if (!details || !account) {
      throw new ValidationError({ key: 'AccountNotFound' });
    }

    await this.validateActivation(account, details, code);

    await this.detailsRepository.activate(details.getProps().id.value);
    await this.repository.updateStatus(account.getProps().id.value, AccountStatus.verified);
  }

  private static validateRequestNewCode(account: AccountEntity, details: AccountDetailsEntity): void {
    const {
      status,
    } = account.getProps();

    if (status !== AccountStatus.unverified) {
      throw new ValidationError({ key: 'CantRequestNewActivationCode', params: { value: status } });
    }

    const {
      activationCodeCreatedAt,
    } = details.getProps();

    const delay = DateVO.differenceInMinutes(DateVO.now(), activationCodeCreatedAt!);
    if (delay <= ACTIVATION_CODE_REQUEST_DELAY_MINUTES) {
      throw new ValidationError({ key: 'ActivationCodeRequestManyAttempts', params: { value: (ACTIVATION_CODE_REQUEST_DELAY_MINUTES - delay) || 1 } });
    }
  }

  public async requestNewCode(id: string): Promise<void> {
    const account = await this.repository.findByAccount(id);
    const details = await this.detailsRepository.getByAccount(account!.getProps().id.value);
    if (!details || !account) {
      throw new ValidationError({ key: 'AccountNotFound' });
    }

    AccountActivationService.validateRequestNewCode(account, details);

    details.updateActivationCode();

    const {
      email,
      person,
    } = account.getProps();

    const {
      id: detailsId,
      activationCode,
    } = details.getProps();

    await this.detailsRepository.changeActivationCode(detailsId.value, activationCode!);

    await AccountMailer.sendVerificationEmail(email, (person as PersonEntity).getProps().name, activationCode!);
  }
}

import { AccountDetailsEntity, AccountEntity, AccountRole, AccountStatus, PersonEntity } from '@find-me/entities';
import { ValidationError } from '@find-me/errors';
import { AccountPasswordRecoverService } from '../password-recover';
import { AccountService } from '../../base';
import { UUID } from '@find-me/uuid';
import { DateVO } from '@find-me/date';
import { AccountMailer } from '../../mailer';

jest.mock('../../base');

const account = new AccountEntity({
  id: UUID.generate(),
  props: {
    email: 'test@example.com',
    status: AccountStatus.unverified,
    role: AccountRole.default,
    password: '7adc926f386ea65a7585b47b45bca75a1deb4558f8a89a6256a8c0a705e44c384fed296e19c9c0d070f34827d5d80a2a81237b8e05eb650e30d555250910bc2893821a2044ed8a2a972d36de21540b3d0f9acf12d9619032057440ebd35efd60719abc7cb78deb0d5cc146020f4b6f9e243cb4f8e17fb42b3557b2e5617b82c1.75100be28442c037f7f4e24c4bc9e694bf75666e32042459e852ee952b3366ed',
    person: new PersonEntity({
      id: UUID.generate(),
      props: {
        name: 'Alice',
        birthDate: new DateVO('2000-01-01'),
      }
    })
  }
});
const accountDetails = new AccountDetailsEntity({
  id: UUID.generate(),
  props: {
    lastSignInAt: undefined,
    lastFailedSignInAttempt: undefined,
    failedSignInAttempts: 0,
    activationCode: '123456',
    activationCodeCreatedAt: DateVO.now().subMinutes(5),
    recoverCode: '123456',
    recoverCodeCreatedAt: DateVO.now().subMinutes(6),
    account: account.getProps().id,
  },
});

let accountRepositoryFindByEmailMock: jest.Mock;
let accountRepositoryUpdatePasswordMock: jest.Mock;

let detailsRepositoryGetByAccountMock: jest.Mock;
let detailsRepositoryChangePasswordRecoverCodeMock: jest.Mock;
let detailsRepositoryResetFailedPasswordRecoverMock: jest.Mock;
let detailsRepositoryIncreaseFailedPasswordRecoverMock: jest.Mock;

let mailerSendRecoverPasswordEmail: jest.Mock;

describe('AccountPasswordRecoverService', () => {
  beforeEach(() => {
    accountRepositoryFindByEmailMock = jest.fn().mockResolvedValue(account);
    accountRepositoryUpdatePasswordMock = jest.fn();

    detailsRepositoryGetByAccountMock = jest.fn().mockResolvedValue(accountDetails);
    detailsRepositoryChangePasswordRecoverCodeMock = jest.fn();
    detailsRepositoryResetFailedPasswordRecoverMock = jest.fn();
    detailsRepositoryIncreaseFailedPasswordRecoverMock = jest.fn();

    mailerSendRecoverPasswordEmail = jest.fn();

    // @ts-ignore
    AccountService.prototype.repository = {
      findByEmail: accountRepositoryFindByEmailMock,
      updatePassword: accountRepositoryUpdatePasswordMock,
    };
    // @ts-ignore
    AccountService.prototype.detailsRepository = {
      getByAccount: detailsRepositoryGetByAccountMock,
      changePasswordRecoverCode: detailsRepositoryChangePasswordRecoverCodeMock,
      resetFailedPasswordRecover: detailsRepositoryResetFailedPasswordRecoverMock,
      increaseFailedPasswordRecover: detailsRepositoryIncreaseFailedPasswordRecoverMock,
    };

    AccountMailer.sendRecoverPasswordEmail = mailerSendRecoverPasswordEmail;
  });

  afterEach(() => {
    // Reset all mocks after each test
    jest.resetAllMocks();
  });

  describe('requestNewCode', () => {
    it('should request a new recover code', async () => {
      const {
        id,
        email,
        person,
      } = account.getProps();
      const {
        id: detailsId,
      } = accountDetails.getProps();

      // Expect the repository methods to have been called with the correct arguments
      await expect(AccountPasswordRecoverService.prototype.requestNewCode.call(new AccountPasswordRecoverService(), email)).resolves.toBeUndefined();
      expect(accountRepositoryFindByEmailMock).toHaveBeenCalledWith(email);
      expect(detailsRepositoryGetByAccountMock).toHaveBeenCalledWith(id.value);
      expect(detailsRepositoryChangePasswordRecoverCodeMock).toHaveBeenCalledWith(detailsId.value, expect.any(String));
      expect(mailerSendRecoverPasswordEmail).toHaveBeenCalledWith(email, (person as PersonEntity).getProps().name, expect.any(String));
    });

    it('should throw an error when account is disabled', async () => {
      const newAccount = new AccountEntity({
        id: UUID.generate(),
        props: {
          email: 'test@example.com',
          status: AccountStatus.disabled,
          role: AccountRole.default,
          password: '7adc926f386ea65a7585b47b45bca75a1deb4558f8a89a6256a8c0a705e44c384fed296e19c9c0d070f34827d5d80a2a81237b8e05eb650e30d555250910bc2893821a2044ed8a2a972d36de21540b3d0f9acf12d9619032057440ebd35efd60719abc7cb78deb0d5cc146020f4b6f9e243cb4f8e17fb42b3557b2e5617b82c1.75100be28442c037f7f4e24c4bc9e694bf75666e32042459e852ee952b3366ed',
          person: new PersonEntity({
            id: UUID.generate(),
            props: {
              name: 'Alice',
              birthDate: new DateVO('2000-01-01'),
            }
          })
        }
      });

      accountRepositoryFindByEmailMock.mockResolvedValue(newAccount);

      const {
        email,
      } = newAccount.getProps();

      await expect(AccountPasswordRecoverService.prototype.requestNewCode.call(new AccountPasswordRecoverService(), email)).rejects.toThrowError(ValidationError);
    });

    it('should throw an error when account is not found', async () => {
      accountRepositoryFindByEmailMock.mockResolvedValue(undefined);

      const {
        email,
      } = account.getProps();

      await expect(AccountPasswordRecoverService.prototype.requestNewCode.call(new AccountPasswordRecoverService(), email)).rejects.toThrowError(ValidationError);
    });
  });

  describe('passwordRecover', () => {
    it('should recover password', async () => {
      const {
        id,
        email,
      } = account.getProps();
      const {
        id: detailsId,
        recoverCode,
      } = accountDetails.getProps();

      // Expect the repository methods to have been called with the correct arguments
      await expect(AccountPasswordRecoverService.prototype.passwordRecover.call(new AccountPasswordRecoverService(), email, recoverCode!, '@Abc1234567')).resolves.toBeUndefined();
      expect(accountRepositoryFindByEmailMock).toHaveBeenCalledWith(email);
      expect(detailsRepositoryGetByAccountMock).toHaveBeenCalledWith(id.value);
      expect(accountRepositoryUpdatePasswordMock).toHaveBeenCalledWith(expect.any(AccountEntity));
      expect(detailsRepositoryResetFailedPasswordRecoverMock).toHaveBeenCalledWith(detailsId.value);
    });

    it('should throw an error when account is disabled', async () => {
      const newAccount = new AccountEntity({
        id: UUID.generate(),
        props: {
          email: 'test@example.com',
          status: AccountStatus.disabled,
          role: AccountRole.default,
          password: '7adc926f386ea65a7585b47b45bca75a1deb4558f8a89a6256a8c0a705e44c384fed296e19c9c0d070f34827d5d80a2a81237b8e05eb650e30d555250910bc2893821a2044ed8a2a972d36de21540b3d0f9acf12d9619032057440ebd35efd60719abc7cb78deb0d5cc146020f4b6f9e243cb4f8e17fb42b3557b2e5617b82c1.75100be28442c037f7f4e24c4bc9e694bf75666e32042459e852ee952b3366ed',
          person: new PersonEntity({
            id: UUID.generate(),
            props: {
              name: 'Alice',
              birthDate: new DateVO('2000-01-01'),
            }
          })
        }
      });

      accountRepositoryFindByEmailMock.mockResolvedValue(newAccount);

      const {
        email,
      } = newAccount.getProps();
      const {
        recoverCode,
      } = accountDetails.getProps();

      await expect(AccountPasswordRecoverService.prototype.passwordRecover.call(new AccountPasswordRecoverService(), email, recoverCode!, '@Abc1234567')).rejects.toThrowError(ValidationError);
    });

    it('should throw an error if account is not found', async () => {
      accountRepositoryFindByEmailMock.mockResolvedValue(undefined);
      
      const {
        email,
      } = account.getProps();
      const {
        recoverCode,
      } = accountDetails.getProps();

      await expect(AccountPasswordRecoverService.prototype.passwordRecover.call(new AccountPasswordRecoverService(), email, recoverCode!, '@Abc1234567')).rejects.toThrowError(ValidationError);
    });

    it('should throw an error if account details is not found', async () => {
      detailsRepositoryGetByAccountMock.mockResolvedValue(undefined);

      const {
        email,
      } = account.getProps();
      const {
        recoverCode,
      } = accountDetails.getProps();

      await expect(AccountPasswordRecoverService.prototype.passwordRecover.call(new AccountPasswordRecoverService(), email, recoverCode!, '@Abc1234567')).rejects.toThrowError(ValidationError);
    });

    it('should throw an error when failed recover attempts limit was reached and not enough time passed', async () => {
      const newAccountDetails = new AccountDetailsEntity({
        id: UUID.generate(),
        props: {
          lastSignInAt: undefined,
          lastFailedSignInAttempt: undefined,
          failedSignInAttempts: 0,
          activationCode: '123456',
          activationCodeCreatedAt: DateVO.now().subMinutes(5),
          recoverCode: '123456',
          recoverCodeCreatedAt: DateVO.now().subMinutes(1),
          account: account.getProps().id,
        },
      });

      detailsRepositoryGetByAccountMock.mockResolvedValue(newAccountDetails);
      
      const {
        email,
      } = account.getProps();
      const {
        recoverCode,
      } = accountDetails.getProps();

      await expect(AccountPasswordRecoverService.prototype.passwordRecover.call(new AccountPasswordRecoverService(), email, recoverCode!, '@Abc1234567')).rejects.toThrowError(ValidationError);
    });

    it('should throw an error if recover code is invalid', async () => {
      const {
        email,
      } = account.getProps();

      await expect(AccountPasswordRecoverService.prototype.passwordRecover.call(new AccountPasswordRecoverService(), email, 'recover-code-invalid', '@Abc1234567')).rejects.toThrowError(ValidationError);
    });

    it('should not throw an error when failed recover attempts is greater than max failed recovers', async () => {
      const newAccountDetails = new AccountDetailsEntity({
        id: UUID.generate(),
        props: {
          lastSignInAt: undefined,
          lastFailedSignInAttempt: undefined,
          failedSignInAttempts: 3,
          activationCode: '123456',
          activationCodeCreatedAt: DateVO.now().subMinutes(5),
          recoverCode: '123456',
          recoverCodeCreatedAt: DateVO.now().subMinutes(1),
          account: account.getProps().id,
        },
      });

      detailsRepositoryGetByAccountMock.mockResolvedValue(newAccountDetails);
      
      const {
        email,
      } = account.getProps();
      const {
        recoverCode,
      } = accountDetails.getProps();

      await expect(AccountPasswordRecoverService.prototype.passwordRecover.call(new AccountPasswordRecoverService(), email, recoverCode!, '@Abc1234567')).rejects.toThrowError(ValidationError);
    });

    it('should not throw an error when recover code is expired', async () => {
      const newAccountDetails = new AccountDetailsEntity({
        id: UUID.generate(),
        props: {
          lastSignInAt: undefined,
          lastFailedSignInAttempt: undefined,
          failedSignInAttempts: 1,
          activationCode: '123456',
          activationCodeCreatedAt: DateVO.now().subMinutes(5),
          recoverCode: '123456',
          recoverCodeCreatedAt: DateVO.now().subMinutes(16),
          account: account.getProps().id,
        },
      });

      detailsRepositoryGetByAccountMock.mockResolvedValue(newAccountDetails);
      
      const {
        email,
      } = account.getProps();
      const {
        recoverCode,
      } = accountDetails.getProps();

      await expect(AccountPasswordRecoverService.prototype.passwordRecover.call(new AccountPasswordRecoverService(), email, recoverCode!, '@Abc1234567')).rejects.toThrowError(ValidationError);
    });
  });
});

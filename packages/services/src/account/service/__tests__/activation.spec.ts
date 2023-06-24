import { AccountDetailsEntity, AccountEntity, AccountRole, AccountStatus, PersonEntity } from '@find-me/entities';
import { ValidationError } from '@find-me/errors';
import { AccountActivationService } from '../activation';
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
    password: '@Abc123456',
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
    account: account.getProps().id,
  },
});

let accountRepositoryFindByAccountMock: jest.Mock;
let accountRepositoryUpdateStatus: jest.Mock;

let detailsRepositoryGetByAccountMock: jest.Mock;
let detailsRepositoryActivateMock: jest.Mock;
let detailsRepositoryIncreaseFailedActivationAttemptsMock: jest.Mock;
let detailsRepositoryChangeActivationCodeMock: jest.Mock;

let mailerSendVerificationEmail: jest.Mock;

describe('AccountActivationService', () => {
  beforeEach(() => {
    accountRepositoryFindByAccountMock = jest.fn().mockResolvedValue(account);
    accountRepositoryUpdateStatus = jest.fn();

    detailsRepositoryGetByAccountMock = jest.fn().mockResolvedValue(accountDetails);
    detailsRepositoryActivateMock = jest.fn();
    detailsRepositoryIncreaseFailedActivationAttemptsMock = jest.fn();
    detailsRepositoryChangeActivationCodeMock = jest.fn();

    mailerSendVerificationEmail = jest.fn();

    // @ts-ignore
    AccountService.prototype.repository = {
      findByAccount: accountRepositoryFindByAccountMock,
      updateStatus: accountRepositoryUpdateStatus,
    };
    // @ts-ignore
    AccountService.prototype.detailsRepository = {
      getByAccount: detailsRepositoryGetByAccountMock,
      activate: detailsRepositoryActivateMock,
      increaseFailedActivationAttempts: detailsRepositoryIncreaseFailedActivationAttemptsMock,
      changeActivationCode: detailsRepositoryChangeActivationCodeMock,
    };

    AccountMailer.sendVerificationEmail = mailerSendVerificationEmail;
  });

  afterEach(() => {
    // Reset all mocks after each test
    jest.resetAllMocks();
  });

  describe('activation', () => {
    it('should activate account with valid code', async () => {
      const {
        id
      } = account.getProps();
      const {
        id: detailsId,
      } = accountDetails.getProps();

      // Expect the repository methods to have been called with the correct arguments
      await expect(AccountActivationService.prototype.activation.call(new AccountActivationService(), id.value, '123456')).resolves.toBeUndefined();
      expect(detailsRepositoryGetByAccountMock).toHaveBeenCalledWith(id.value);
      expect(detailsRepositoryActivateMock).toHaveBeenCalledWith(detailsId.value);
      expect(accountRepositoryUpdateStatus).toHaveBeenCalledWith(id.value, AccountStatus.verified);
    });

    it('should throw validation error for wrong activation code', async () => {
      const {
        id
      } = account.getProps();
      const {
        id: detailsId,
      } = accountDetails.getProps();

      // Call the activation method with an invalid activation code
      await expect(AccountActivationService.prototype.activation.call(new AccountActivationService(), id.value, '123')).rejects.toThrowError(ValidationError);
      // Expect the failedActivationAttempts to have increased by 1
      expect(detailsRepositoryIncreaseFailedActivationAttemptsMock).toHaveBeenCalledWith(detailsId.value);
    });

    it('should throw validation error if account is not found', async () => {
      accountRepositoryFindByAccountMock.mockResolvedValue(undefined);

      const {
        id
      } = account.getProps();

      // Call the activation method with an invalid activation code
      await expect(AccountActivationService.prototype.activation.call(new AccountActivationService(), id.value, '123')).rejects.toThrowError(ValidationError);
    });

    it('should throw validation error if account details is not found', async () => {
      detailsRepositoryGetByAccountMock.mockResolvedValue(undefined);

      const {
        id
      } = account.getProps();

      // Call the activation method with an invalid activation code
      await expect(AccountActivationService.prototype.activation.call(new AccountActivationService(), id.value, '123')).rejects.toThrowError(ValidationError);
    });

    it('should throw validation error if account status is not unverified', async () => {
      const newAccount = new AccountEntity({
        id: UUID.generate(),
        props: {
          email: 'test@example.com',
          status: AccountStatus.verified,
          role: AccountRole.default,
          password: '@Abc123456',
          person: new PersonEntity({
            id: UUID.generate(),
            props: {
              name: 'Alice',
              birthDate: new DateVO('2000-01-01'),
            }
          })
        }
      });

      accountRepositoryFindByAccountMock.mockResolvedValue(newAccount);

      const {
        id
      } = newAccount.getProps();

      // Call the activation method with an invalid activation code
      await expect(AccountActivationService.prototype.activation.call(new AccountActivationService(), id.value, '123')).rejects.toThrowError(ValidationError);
    });

    it('should throw validation error if failedActivationAttempts exceeds max attempts', async () => {
      const newAccountDetails = new AccountDetailsEntity({
        id: UUID.generate(),
        props: {
          lastSignInAt: undefined,
          lastFailedSignInAttempt: undefined,
          failedSignInAttempts: 0,
          activationCode: '123456',
          activationCodeCreatedAt: DateVO.now().subMinutes(5),
          failedActivationAttempts: 3,
          account: account.getProps().id,
        },
      });

      detailsRepositoryGetByAccountMock.mockResolvedValue(newAccountDetails);

      const {
        id
      } = account.getProps();

      // Call the activation method with an invalid activation code
      await expect(AccountActivationService.prototype.activation.call(new AccountActivationService(), id.value, '123')).rejects.toThrowError(ValidationError);
    });

    it('should throw validation error if code is expired', async () => {
      const newAccountDetails = new AccountDetailsEntity({
        id: UUID.generate(),
        props: {
          lastSignInAt: undefined,
          lastFailedSignInAttempt: undefined,
          failedSignInAttempts: 0,
          activationCode: '123456',
          activationCodeCreatedAt: DateVO.now().subMinutes(31),
          failedActivationAttempts: 1,
          account: account.getProps().id,
        },
      });

      detailsRepositoryGetByAccountMock.mockResolvedValue(newAccountDetails);

      const {
        id
      } = account.getProps();

      // Call the activation method with an invalid activation code
      await expect(AccountActivationService.prototype.activation.call(new AccountActivationService(), id.value, '123')).rejects.toThrowError(ValidationError);
    });
  });

  describe('requestNewCode', () => {
    it('should generate new activation code and send email', async () => {
      const {
        id,
        email,
        person,
      } = account.getProps();
      const {
        id: detailsId,
      } = accountDetails.getProps();

      // Expect the repository methods to have been called with the correct arguments
      await expect(AccountActivationService.prototype.requestNewCode.call(new AccountActivationService(), id.value)).resolves.toBeUndefined();
      expect(detailsRepositoryGetByAccountMock).toHaveBeenCalledWith(id.value);
      expect(detailsRepositoryChangeActivationCodeMock).toHaveBeenCalledWith(detailsId.value, expect.any(String));

      // Expect the mailer to have been called with the correct arguments
      expect(mailerSendVerificationEmail).toHaveBeenCalledWith(email, (person as PersonEntity).getProps().name, expect.any(String));
    });

    it('should throw validation error for too many activation code requests', async () => {
      detailsRepositoryGetByAccountMock.mockResolvedValue(
        new AccountDetailsEntity({
          id: UUID.generate(),
          props: {
            lastSignInAt: undefined,
            lastFailedSignInAttempt: undefined,
            failedSignInAttempts: 0,
            activationCode: '123456',
            activationCodeCreatedAt: DateVO.now(),
            account: account.getProps().id,
          },
        }),
      );

      const {
        id,
      } = account.getProps();

      // Call the requestNewCode method again before allowed time
      await expect(AccountActivationService.prototype.requestNewCode.call(new AccountActivationService(), id.value)).rejects.toThrowError(ValidationError);
    });

    it('should throw validation error for too many activation code requests -4 minutes', async () => {
      detailsRepositoryGetByAccountMock.mockResolvedValue(
        new AccountDetailsEntity({
          id: UUID.generate(),
          props: {
            lastSignInAt: undefined,
            lastFailedSignInAttempt: undefined,
            failedSignInAttempts: 0,
            activationCode: '123456',
            activationCodeCreatedAt: DateVO.now().subMinutes(4),
            account: account.getProps().id,
          },
        }),
      );

      const {
        id,
      } = account.getProps();

      // Call the requestNewCode method again before allowed time
      await expect(AccountActivationService.prototype.requestNewCode.call(new AccountActivationService(), id.value)).rejects.toThrowError(ValidationError);
    });

    it('should throw validation error if account status is not unverified', async () => {
      const newAccount = new AccountEntity({
        id: UUID.generate(),
        props: {
          email: 'test@example.com',
          status: AccountStatus.verified,
          role: AccountRole.default,
          password: '@Abc123456',
          person: new PersonEntity({
            id: UUID.generate(),
            props: {
              name: 'Alice',
              birthDate: new DateVO('2000-01-01'),
            }
          })
        }
      });

      accountRepositoryFindByAccountMock.mockResolvedValue(newAccount);

      const {
        id,
      } = account.getProps();

      // Call the requestNewCode method again before allowed time
      await expect(AccountActivationService.prototype.requestNewCode.call(new AccountActivationService(), id.value)).rejects.toThrowError(ValidationError);
    });

    it('should throw validation error if account is not found', async () => {
      accountRepositoryFindByAccountMock.mockResolvedValue(undefined);

      const {
        id,
      } = account.getProps();

      // Call the requestNewCode method again before allowed time
      await expect(AccountActivationService.prototype.requestNewCode.call(new AccountActivationService(), id.value)).rejects.toThrowError(ValidationError);
    });

    it('should throw validation error if account details is not found', async () => {
      detailsRepositoryGetByAccountMock.mockResolvedValue(undefined);

      const {
        id,
      } = account.getProps();

      // Call the requestNewCode method again before allowed time
      await expect(AccountActivationService.prototype.requestNewCode.call(new AccountActivationService(), id.value)).rejects.toThrowError(ValidationError);
    });
  });
});

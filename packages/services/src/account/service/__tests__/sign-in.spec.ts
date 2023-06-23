import { AccountStatus, AccountEntity, AccountRole } from '@find-me/entities';
import { ValidationError } from '@find-me/errors';
import { scryptSync } from 'crypto';
import { DateVO } from '@find-me/date';
import { AccountService } from '../../base';
import { Authentication } from '../../authentication';
import { AccountDetailsEntity } from '@find-me/entities';

import { AccountSignInService } from '../sign-in';
import { UUID } from '@find-me/uuid';

jest.mock('crypto');
jest.mock('../../base');
jest.mock('../../authentication');

const MAX_FAILED_SIGN_IN_ATTEMPTS = 3;

describe('AccountSignInService', () => {
  // @ts-ignore
  let accountRepositoryFindByEmailMock: jest.MockedFunction<typeof AccountService.prototype.repository.findByEmail>;
  // @ts-ignore
  let detailsRepositoryGetByAccountMock: jest.MockedFunction<typeof AccountService.prototype.detailsRepository.getByAccount>;
  // @ts-ignore
  let detailsRepositoryIncreaseFailedSignInMock: jest.MockedFunction<typeof AccountService.prototype.detailsRepository.increaseFailedSignIn>;
  // @ts-ignore
  let detailsRepositorySaveLastSignInMock: jest.MockedFunction<typeof AccountService.prototype.detailsRepository.saveLastSignIn>;
  let authenticationGenerateTokenMock: jest.MockedFunction<typeof Authentication.generateToken>;

  const accountId = 'b578040f-34d4-43cf-9105-efb0be3d813e';
  const email = 'test@test.com';
  const password = '123456';
  const currentPasswordEncrypted = '49b4cd00502a9e839fc3ecfa238dcaf0.1bf08c67f8be61f8937b6ab008b1ee8eabb4c90a09c0c2da560bdfc3087d1212';

  beforeEach(() => {
    accountRepositoryFindByEmailMock = jest.fn().mockResolvedValue(
      new AccountEntity({
        id: accountId,
        props: {
          email,
          password: currentPasswordEncrypted,
          status: AccountStatus.verified,
          role: AccountRole.default,
          person: new UUID('b578040f-34d4-43cf-9105-efb0be3d813e'),
        },
      }),
    );

    detailsRepositoryGetByAccountMock = jest.fn().mockResolvedValue(
      new AccountDetailsEntity({
        id: accountId,
        props: {
          lastSignInAt: undefined,
          lastFailedSignInAttempt: undefined,
          failedSignInAttempts: 0,
          account: new UUID('b578040f-34d4-43cf-9105-efb0be3d813e'),
        },
      }),
    );

    detailsRepositoryIncreaseFailedSignInMock = jest.fn();

    detailsRepositorySaveLastSignInMock = jest.fn();

    authenticationGenerateTokenMock = jest.fn().mockReturnValue('test-token');

    // @ts-ignore
    AccountService.prototype.repository = {};
    // @ts-ignore
    AccountService.prototype.detailsRepository = {};
    // @ts-ignore
    (AccountService.prototype.repository.findByEmail as jest.MockedFunction<typeof AccountService.prototype.repository.findByEmail>) = accountRepositoryFindByEmailMock;
    // @ts-ignore
    (AccountService.prototype.detailsRepository.getByAccount as jest.MockedFunction<typeof AccountService.prototype.detailsRepository.getByAccount>) = detailsRepositoryGetByAccountMock;
    // @ts-ignore
    (AccountService.prototype.detailsRepository.increaseFailedSignIn as jest.MockedFunction<typeof AccountService.prototype.detailsRepository.increaseFailedSignIn>) = detailsRepositoryIncreaseFailedSignInMock;
    // @ts-ignore
    (AccountService.prototype.detailsRepository.saveLastSignIn as jest.MockedFunction<typeof AccountService.prototype.detailsRepository.saveLastSignIn>) = detailsRepositorySaveLastSignInMock;
    (Authentication.generateToken as jest.MockedFunction<typeof Authentication.generateToken>) = authenticationGenerateTokenMock;
  });

  describe('signIn', () => {
    it('should throw ValidationError when account is not found', async () => {
      // @ts-ignore
      accountRepositoryFindByEmailMock.mockResolvedValueOnce(null);

      await expect(AccountSignInService.prototype.signIn.call(new AccountSignInService(), email, password)).rejects.toThrowError(ValidationError);
      expect(accountRepositoryFindByEmailMock).toHaveBeenCalledTimes(1);
      expect(detailsRepositoryGetByAccountMock).not.toHaveBeenCalled();
      expect(detailsRepositoryIncreaseFailedSignInMock).not.toHaveBeenCalled();
      expect(detailsRepositorySaveLastSignInMock).not.toHaveBeenCalled();
      expect(authenticationGenerateTokenMock).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when account status is disabled', async () => {
      accountRepositoryFindByEmailMock.mockResolvedValueOnce(
        new AccountEntity({
          id: accountId,
          props: {
            email,
            password: currentPasswordEncrypted,
            status: AccountStatus.disabled,
            person: new UUID('b578040f-34d4-43cf-9105-efb0be3d813e'),
            role: AccountRole.default,
          }
        }),
      );

      await expect(AccountSignInService.prototype.signIn.call(new AccountSignInService(), email, password)).rejects.toThrowError(ValidationError);
      expect(accountRepositoryFindByEmailMock).toHaveBeenCalledTimes(1);
      expect(detailsRepositoryGetByAccountMock).not.toHaveBeenCalled();
      expect(detailsRepositoryIncreaseFailedSignInMock).not.toHaveBeenCalled();
      expect(detailsRepositorySaveLastSignInMock).not.toHaveBeenCalled();
      expect(authenticationGenerateTokenMock).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when failed sign-in attempts limit was reached and not enough time passed', async () => {
      const lastFailedSignInAttempt = DateVO.now();
      const details = new AccountDetailsEntity({
        id: accountId,
        props: {
          lastSignInAt: undefined,
          lastFailedSignInAttempt,
          failedSignInAttempts: MAX_FAILED_SIGN_IN_ATTEMPTS + 1,
          account: new UUID('b578040f-34d4-43cf-9105-efb0be3d813e'),
        },
      });

      detailsRepositoryGetByAccountMock.mockResolvedValueOnce(details);

      await expect(AccountSignInService.prototype.signIn.call(new AccountSignInService(), email, password)).rejects.toThrowError(ValidationError);
      expect(accountRepositoryFindByEmailMock).toHaveBeenCalledTimes(1);
      expect(detailsRepositoryGetByAccountMock).toHaveBeenCalledTimes(1);
      expect(detailsRepositoryIncreaseFailedSignInMock).not.toHaveBeenCalled();
      expect(detailsRepositorySaveLastSignInMock).not.toHaveBeenCalled();
      expect(authenticationGenerateTokenMock).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when failed sign-in attempts limit was reached and not enough time passed -2 minutes', async () => {
      const lastFailedSignInAttempt = DateVO.now().subMinutes(2);
      const details = new AccountDetailsEntity({
        id: accountId,
        props: {
          lastSignInAt: undefined,
          lastFailedSignInAttempt,
          failedSignInAttempts: MAX_FAILED_SIGN_IN_ATTEMPTS + 1,
          account: new UUID('b578040f-34d4-43cf-9105-efb0be3d813e'),
        },
      });

      detailsRepositoryGetByAccountMock.mockResolvedValueOnce(details);

      await expect(AccountSignInService.prototype.signIn.call(new AccountSignInService(), email, password)).rejects.toThrowError(ValidationError);
      expect(accountRepositoryFindByEmailMock).toHaveBeenCalledTimes(1);
      expect(detailsRepositoryGetByAccountMock).toHaveBeenCalledTimes(1);
      expect(detailsRepositoryIncreaseFailedSignInMock).not.toHaveBeenCalled();
      expect(detailsRepositorySaveLastSignInMock).not.toHaveBeenCalled();
      expect(authenticationGenerateTokenMock).not.toHaveBeenCalled();
    });

    it('should not throw ValidationError when failed sign-in attempts limit was reached and not enough time passed -20 minutes', async () => {
      const lastFailedSignInAttempt = DateVO.now().subMinutes(20);
      const details = new AccountDetailsEntity({
        id: accountId,
        props: {
          lastSignInAt: undefined,
          lastFailedSignInAttempt,
          failedSignInAttempts: MAX_FAILED_SIGN_IN_ATTEMPTS + 1,
          account: new UUID('b578040f-34d4-43cf-9105-efb0be3d813e'),
        },
      });

      detailsRepositoryGetByAccountMock.mockResolvedValueOnce(details);
      (scryptSync as jest.MockedFunction<typeof scryptSync>).mockReturnValueOnce(Buffer.from(currentPasswordEncrypted, 'hex'));

      await expect(AccountSignInService.prototype.signIn.call(new AccountSignInService(), email, password)).resolves.toBeTruthy();
      expect(accountRepositoryFindByEmailMock).toHaveBeenCalledTimes(1);
      expect(detailsRepositoryGetByAccountMock).toHaveBeenCalledTimes(1);
      expect(detailsRepositoryIncreaseFailedSignInMock).not.toHaveBeenCalled();
      expect(detailsRepositorySaveLastSignInMock).toHaveBeenCalledTimes(1);
      expect(authenticationGenerateTokenMock).toHaveBeenCalledTimes(1);
    });

    it('should increase failed sign-in attempts and throw ValidationError when password is invalid', async () => {
      const details = new AccountDetailsEntity({
        id: accountId,
        props: {
          lastSignInAt: undefined,
          lastFailedSignInAttempt: undefined,
          failedSignInAttempts: 0,
          account: new UUID('b578040f-34d4-43cf-9105-efb0be3d813e'),
        },
      });
      const inputPassword = '111111';
      const inputPasswordEncrypted = '16b3b1a9ff6d78e1bf45a9da02aa5c35.e899287f4f828ec2d7cc30975cbc0b36014e7c497ddaaedd7f13f01cf46a6079';

      detailsRepositoryGetByAccountMock.mockResolvedValueOnce(details);
      (scryptSync as jest.MockedFunction<typeof scryptSync>).mockReturnValueOnce(Buffer.from(inputPasswordEncrypted, 'hex'));

      await expect(AccountSignInService.prototype.signIn.call(new AccountSignInService(), email, inputPassword)).rejects.toThrowError(ValidationError);
      expect(accountRepositoryFindByEmailMock).toHaveBeenCalledTimes(1);
      expect(detailsRepositoryGetByAccountMock).toHaveBeenCalledTimes(1);
      expect(detailsRepositoryIncreaseFailedSignInMock).toHaveBeenCalledTimes(1);
      expect(detailsRepositoryIncreaseFailedSignInMock).toHaveBeenCalledWith(accountId);
      expect(detailsRepositorySaveLastSignInMock).not.toHaveBeenCalled();
      expect(authenticationGenerateTokenMock).not.toHaveBeenCalled();
    });

    it('should save last sign-in date, reset failed sign-in attempts and return JWT token when sign in is successful', async () => {
      const oldDetails = new AccountDetailsEntity({
        id: accountId,
        props: {
          lastSignInAt: undefined,
          lastFailedSignInAttempt: DateVO.now().subMinutes(10),
          failedSignInAttempts: 3,
          account: new UUID('b578040f-34d4-43cf-9105-efb0be3d813e'),
        },
      });

      detailsRepositoryGetByAccountMock.mockResolvedValueOnce(oldDetails);
      (scryptSync as jest.MockedFunction<typeof scryptSync>).mockReturnValueOnce(Buffer.from(currentPasswordEncrypted, 'hex'));

      await expect(AccountSignInService.prototype.signIn.call(new AccountSignInService(), email, password)).resolves.toBe('test-token');
      expect(accountRepositoryFindByEmailMock).toHaveBeenCalledTimes(1);
      expect(detailsRepositoryGetByAccountMock).toHaveBeenCalledTimes(1);
      expect(detailsRepositoryIncreaseFailedSignInMock).not.toHaveBeenCalled();
      expect(detailsRepositorySaveLastSignInMock).toHaveBeenCalledTimes(1);
      expect(detailsRepositorySaveLastSignInMock).toHaveBeenCalledWith(accountId);
      expect(authenticationGenerateTokenMock).toHaveBeenCalledTimes(1);
    });
  });
});

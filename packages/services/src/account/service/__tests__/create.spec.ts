import { AccountDetailsEntity, AccountEntity, AccountRole, AccountStatus, PersonEntity } from '@find-me/entities';
import { ValidationError } from '@find-me/errors';
import { AccountCreateService } from '../create';
import { AccountService } from '../../base';
import { DateVO } from '@find-me/date';
import { AccountMailer } from '../../mailer';

jest.mock('../../base');

let repositoryCreateMock: jest.Mock;
let repositoryEmailExistsMock: jest.Mock;
let detailsRepositoryCreateMock: jest.Mock;
let personRepositoryCreateMock: jest.Mock;

let mailerSendVerificationEmailMock: jest.Mock;

describe('AccountCreateService', () => {
  beforeEach(() => {
    repositoryCreateMock = jest.fn();
    repositoryEmailExistsMock = jest.fn().mockResolvedValue(false);
    detailsRepositoryCreateMock = jest.fn();
    personRepositoryCreateMock = jest.fn();

    mailerSendVerificationEmailMock = jest.fn();

    // @ts-ignore
    AccountCreateService.prototype.repository = {
      create: repositoryCreateMock,
      emailExists: repositoryEmailExistsMock,
    };
    // @ts-ignore
    AccountCreateService.prototype.detailsRepository = {
      create: detailsRepositoryCreateMock,
    };
    // @ts-ignore
    AccountCreateService.prototype.personRepository = {
      create: personRepositoryCreateMock,
    };

    AccountMailer.sendVerificationEmail = mailerSendVerificationEmailMock;
  });

  afterEach(() => {
    // Reset all mocks after each test
    jest.resetAllMocks();
  });

  describe('create', () => {
    it('should create a new account', async () => {
      await expect(AccountCreateService.prototype.create.call(
        new AccountCreateService(),
        {
          email: 'test@example.com',
          password: '@Abc123456',
          role: AccountRole.default,
          status: AccountStatus.unverified,
        },
        {
          birthDate: new DateVO('2000-01-01'),
          name: 'Alice Saturnine',
        },
      )).resolves.toBeUndefined();

      expect(repositoryEmailExistsMock).toHaveBeenCalledWith('test@example.com');
      expect(repositoryCreateMock).toHaveBeenCalledWith(expect.any(AccountEntity));
      expect(detailsRepositoryCreateMock).toHaveBeenCalledWith(expect.any(AccountDetailsEntity));
      expect(personRepositoryCreateMock).toHaveBeenCalledWith(expect.any(PersonEntity));
      expect(mailerSendVerificationEmailMock).toHaveBeenCalledWith('test@example.com', 'Alice Saturnine', expect.any(String));
    });

    it('should throw an error if the email already exists', async () => {
      repositoryEmailExistsMock.mockResolvedValue(true);

      await expect(AccountCreateService.prototype.create.call(
        new AccountCreateService(),
        {
          email: 'test@example.com',
          password: '@Abc123456',
          role: AccountRole.default,
          status: AccountStatus.unverified,
        },
        {
          birthDate: new DateVO('2000-01-01'),
          name: 'Alice Saturnine',
        },
      )).rejects.toThrowError(ValidationError);

      expect(repositoryEmailExistsMock).toHaveBeenCalledWith('test@example.com');
      expect(repositoryCreateMock).toHaveBeenCalledTimes(0);
      expect(detailsRepositoryCreateMock).toHaveBeenCalledTimes(0);
      expect(personRepositoryCreateMock).toHaveBeenCalledTimes(0);
      expect(mailerSendVerificationEmailMock).toHaveBeenCalledTimes(0);
    });
  });
});

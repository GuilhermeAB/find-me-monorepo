import { AccountEntity, AccountRole, AccountStatus, PersonEntity } from '@find-me/entities';
import { ValidationError } from '@find-me/errors';
import { AccountUpdate } from '../update';
import { AccountService } from '../../base';
import { DateVO } from '@find-me/date';
import { UUID } from '@find-me/uuid';

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

let repositoryFindOneByIdMock: jest.Mock;
let repositoryUpdatePasswordMock: jest.Mock;

let personRepositoryUpdateOneMock: jest.Mock;

describe('AccountUpdate', () => {
  beforeEach(() => {
    repositoryUpdatePasswordMock = jest.fn();
    repositoryFindOneByIdMock = jest.fn().mockResolvedValue(account);
    
    personRepositoryUpdateOneMock = jest.fn();

    // @ts-ignore
    AccountService.prototype.repository = {
      findOneById: repositoryFindOneByIdMock,
      updatePassword: repositoryUpdatePasswordMock,
    };
    // @ts-ignore
    AccountService.prototype.personRepository = {
      updateOne: personRepositoryUpdateOneMock,
    };
  });

  afterEach(() => {
    // Reset all mocks after each test
    jest.resetAllMocks();
  });

  describe('updatePerson', () => {
    it('should update the person', async () => {
      await expect(AccountUpdate.prototype.updatePerson.call(
        new AccountUpdate(),
        UUID.generate().value,
        'Alice Saturnine Update',
        '1999-01-01',
      )).resolves.toBeUndefined();
      expect(personRepositoryUpdateOneMock).toHaveBeenCalledWith(expect.any(PersonEntity));
    });
  });

  describe('updatePassword', () => {
    it('should update password', async () => {
      await expect(AccountUpdate.prototype.updatePassword.call(
        new AccountUpdate(),
        account.getProps().id.value,
        '@Abc123456',
        '@Abc1234567',
      )).resolves.toBeUndefined();
      expect(repositoryFindOneByIdMock).toHaveBeenCalledWith(expect.any(String));
      expect(repositoryUpdatePasswordMock).toHaveBeenCalledWith(expect.any(AccountEntity));
    });

    it('should throw an error when password is invalid', async () => {
      await expect(AccountUpdate.prototype.updatePassword.call(
        new AccountUpdate(),
        account.getProps().id.value,
        'invalid-password',
        '@Abc1234567',
      )).rejects.toThrowError(ValidationError);
    });

    it('should throw an error if account is not found', async () => {
      repositoryFindOneByIdMock.mockResolvedValue(undefined);

      await expect(AccountUpdate.prototype.updatePassword.call(
        new AccountUpdate(),
        account.getProps().id.value,
        '@Abc123456',
        '@Abc1234567',
      )).rejects.toThrowError(ValidationError);
    });
  });
});

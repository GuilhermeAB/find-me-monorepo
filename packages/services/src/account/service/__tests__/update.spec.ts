import { AccountDetailsEntity, AccountEntity, AccountRole, AccountStatus, PersonEntity } from '@find-me/entities';
import { ValidationError } from '@find-me/errors';
import { AccountUpdate } from '../update';
import { AccountService } from '../../base';
import { DateVO } from '@find-me/date';
import { UUID } from '@find-me/uuid';

jest.mock('../../base');

let personRepositoryUpdateOneMock: jest.Mock;

describe('AccountUpdate', () => {
  beforeEach(() => {
    personRepositoryUpdateOneMock = jest.fn();

    // @ts-ignore
    // AccountService.prototype.repository = {
    //   create: repositoryCreateMock,
    //   emailExists: repositoryEmailExistsMock,
    // };
    // @ts-ignore
    // AccountService.prototype.detailsRepository = {
    //   create: detailsRepositoryCreateMock,
    // };
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
});

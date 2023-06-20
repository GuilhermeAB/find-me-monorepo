import { Status, ValidationError } from '@find-me/errors';
import { AccountGetLoggedService } from '../get-logged';
import { AccountService } from '../../base';

jest.mock('../../base');

describe('AccountGetLoggedService', () => {
  const service = new AccountGetLoggedService();

  // @ts-ignore
  let repositoryFindByAccountMock: jest.MockedFunction<typeof AccountService.prototype.repository.findByAccount>;

  beforeEach(() => {
    // @ts-ignore
    AccountGetLoggedService.prototype.repository = {};
    // @ts-ignore
    AccountGetLoggedService.prototype.detailsRepository = {};

    repositoryFindByAccountMock = jest.fn();

    // @ts-ignore
    AccountGetLoggedService.prototype.repository.findByAccount = repositoryFindByAccountMock;
  });

  describe('getByAccount', () => {
    it('should return account data without password if account exists', async () => {
      // set up mock behavior of repository
      const mockAccount = {
        id: '123',
        name: 'John',
        email: 'john@example.com',
        password: 'secret',
        getFlatProps: () => ({ id: '123', name: 'John', email: 'john@example.com' }),
      };
      // @ts-ignore
      repositoryFindByAccountMock.mockResolvedValue(mockAccount);
  
      // call the getByAccount method
      const result = await service.getByAccount('123');
  
      // expect the result to be the account data without password
      expect(result).toEqual({
        id: '123',
        name: 'John',
        email: 'john@example.com',
      });
  
      // expect the findByAccount method to have been called with the correct arguments
      expect(repositoryFindByAccountMock).toHaveBeenCalledWith('123');
    });
  
    it('should throw ValidationError if account does not exist', async () => {
      // set up mock behavior of repository
      // @ts-ignore
      repositoryFindByAccountMock.mockResolvedValue(null);
  
      // call the getByAccount method, and expect it to throw a ValidationError
      await expect(service.getByAccount('456')).rejects.toThrowError(
        new ValidationError({
          key: 'AuthenticationRequired',
          status: Status.Unauthorized,
        })
      );
  
      // expect the findByAccount method to have been called with the correct arguments
      expect(repositoryFindByAccountMock).toHaveBeenCalledWith('456');
    });
  });
});

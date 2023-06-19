import { AccountEntity, AccountRole, AccountStatus } from '@find-me/entities';
import { Authentication, TokenBody } from '..';
import { UUID } from '@find-me/uuid';
import { CacheService } from '@find-me/cache';
import { ValidationError } from '@find-me/errors';

const BLOCKLIST_CACHE_FOLDER = 'blocklist';

describe('authentication', () => {
  beforeEach(() => {
    // Mock environment variables
    process.env.AUTHENTICATION_SECRET_TOKEN_HASH = 'secret-token-hash';
    process.env.AUTHENTICATION_SECRET_TOKEN_TIMEOUT = '1h';
    process.env.AUTHENTICATION_SECRET_TOKEN_TIMEOUT_HOURS = '1';
  });

  describe('generateToken', () => {
    it('generateToken should return a JWT token', () => {
      // Create mock account
      const account = new AccountEntity({
        id: UUID.generate(),
        props: {
          status: AccountStatus.verified,
          role: AccountRole.default,
          person: UUID.generate(),
          email: 'teste@gmail.com',
          password: '@Abc123456',
        }
      });

      const token = Authentication.generateToken(account);

      expect(typeof token).toBe('string');
    });

    it('generateToken should throw error if invalid environment', () => {
      delete process.env.AUTHENTICATION_SECRET_TOKEN_HASH;
      delete process.env.AUTHENTICATION_SECRET_TOKEN_TIMEOUT;
      delete process.env.AUTHENTICATION_SECRET_TOKEN_TIMEOUT_HOURS;

      expect(() => Authentication.generateToken(undefined)).toThrowError(ValidationError);
    });
  });

  describe('parseToken', () => {
    it('parseToken should return parsed token body', () => {
      // Mock environment variable
      process.env.AUTHENTICATION_SECRET_TOKEN_HASH = 'secret-token-hash';
    
      const account = new AccountEntity({
        id: UUID.generate(),
        props: {
          status: AccountStatus.verified,
          role: AccountRole.default,
          person: UUID.generate(),
          email: 'teste@gmail.com',
          password: '@Abc123456',
        }
      });

      const token = Authentication.generateToken(account);
      const parsedBody = Authentication.parseToken(token);
    
      expect(parsedBody.accountId).toEqual(account.getProps().id.value);
      expect(parsedBody.personId).toEqual((account.getProps().person as UUID).value);
      expect(parsedBody.tokenId).toBeTruthy();
      expect(parsedBody.role).toEqual(AccountRole.default);
      expect(parsedBody.status).toEqual(AccountStatus.verified);
      expect(parsedBody.createdAt).toBeTruthy();
      expect(parsedBody.revocationDate).toBeTruthy();
    });
  });

  describe('authenticate', () => {
    it('authenticate should return token body if authentication is valid', async () => {
      // Mock environment variables
      process.env.AUTHENTICATION_SECRET_TOKEN_HASH = 'secret-token-hash';
      process.env.REDIS_URL = 'redis://localhost:6379';
      process.env.REDIS_USERNAME = 'test';
      process.env.REDIS_PASSWORD = 'password';

      jest.spyOn(CacheService.prototype, 'exists').mockResolvedValueOnce(false);

      const account = new AccountEntity({
        id: UUID.generate(),
        props: {
          status: AccountStatus.verified,
          role: AccountRole.default,
          person: UUID.generate(),
          email: 'teste@gmail.com',
          password: '@Abc123456',
        }
      });

      const token = Authentication.generateToken(account);
      const value = { authentication: token };
      const parsedBody = await Authentication.authenticate(value);
    
      expect(parsedBody.accountId).toEqual(account.getProps().id.value);
      expect(parsedBody.personId).toEqual((account.getProps().person as UUID).value);
      expect(parsedBody.tokenId).toBeTruthy();
      expect(parsedBody.role).toEqual(AccountRole.default);
      expect(parsedBody.status).toEqual(AccountStatus.verified);
      expect(parsedBody.createdAt).toBeTruthy();
      expect(parsedBody.revocationDate).toBeTruthy();
    });

    it('authenticate should throw error if authentication is not provided', async () => {
      await expect(Authentication.authenticate({})).rejects.toThrowError(ValidationError);
    });

    it('authenticate should throw error if authentication is undefined', async () => {
      await expect(Authentication.authenticate(undefined)).rejects.toThrowError(ValidationError);
    });

    it('authenticate should throw error if authentication status is invalid', async () => {
      const account = new AccountEntity({
        id: UUID.generate(),
        props: {
          status: AccountStatus.unverified,
          role: AccountRole.default,
          person: UUID.generate(),
          email: 'teste@gmail.com',
          password: '@Abc123456',
        }
      });

      const token = Authentication.generateToken(account);
      const value = { authentication: token };

      await expect(Authentication.authenticate(value, AccountStatus.verified)).rejects.toThrowError(ValidationError);
    });

    it('authenticate should throw error if cache exists', async () => {
      // Mock environment variables
      process.env.AUTHENTICATION_SECRET_TOKEN_HASH = 'secret-token-hash';
      process.env.REDIS_URL = 'redis://localhost:6379';
      process.env.REDIS_USERNAME = 'test';
      process.env.REDIS_PASSWORD = 'password';

      jest.spyOn(CacheService.prototype, 'exists').mockResolvedValueOnce(true);

      const account = new AccountEntity({
        id: UUID.generate(),
        props: {
          status: AccountStatus.verified,
          role: AccountRole.default,
          person: UUID.generate(),
          email: 'teste@gmail.com',
          password: '@Abc123456',
        }
      });

      const token = Authentication.generateToken(account);
      const value = { authentication: token };
    
      await expect(Authentication.authenticate(value)).rejects.toThrowError(ValidationError);
    });
  });

  describe('signOut', () => {
    it('signOut should add token to blocklist cache', async () => {
      const cacheAddSpy = jest.spyOn(CacheService.prototype, 'add').mockImplementation(jest.fn())
    
      const account = new AccountEntity({
        id: UUID.generate(),
        props: {
          status: AccountStatus.verified,
          role: AccountRole.default,
          person: UUID.generate(),
          email: 'teste@gmail.com',
          password: '@Abc123456',
        }
      });

      const token = Authentication.generateToken(account);
      const tokenBody = Authentication.parseToken(token);
      await Authentication.signOut(tokenBody);
    
      expect(cacheAddSpy).toHaveBeenCalledTimes(1);
      expect(cacheAddSpy).toHaveBeenCalledWith(
        `${BLOCKLIST_CACHE_FOLDER}:${tokenBody.tokenId}`,
        tokenBody.revocationDate.toString(),
        tokenBody.revocationDate,
      );
    });
  });
});

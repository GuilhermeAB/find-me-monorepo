import { CacheService } from '..';
import { ValidationError } from '@find-me/errors';

describe('CacheService', () => {
  let cache: CacheService;

  beforeEach(() => {
    process.env.REDIS_URL = 'redis://localhost:6379';
    process.env.REDIS_USERNAME = 'test';
    process.env.REDIS_PASSWORD = 'password';

    cache = new CacheService();
    jest.spyOn(cache.client, 'connect').mockResolvedValueOnce(true);
    jest.spyOn(cache.client, 'disconnect').mockResolvedValueOnce(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should throw a validation error if REDIS_URL, REDIS_USERNAME or REDIS_PASSWORD are missing', () => {
      delete process.env.REDIS_URL;
      expect(() => new CacheService()).toThrowError(new ValidationError({ key: 'InvalidEnv' }));

      process.env.REDIS_URL = 'redis://localhost:6379';
      delete process.env.REDIS_USERNAME;
      expect(() => new CacheService()).toThrowError(new ValidationError({ key: 'InvalidEnv' }));

      process.env.REDIS_USERNAME = 'test';
      delete process.env.REDIS_PASSWORD;
      expect(() => new CacheService()).toThrowError(new ValidationError({ key: 'InvalidEnv' }));
    });

    it('should create a Redis client with the correct options', () => {
      expect(cache.client.options.url).toBe(process.env.REDIS_URL);
      expect(cache.client.options.username).toBe(process.env.REDIS_USERNAME);
      expect(cache.client.options.password).toBe(process.env.REDIS_PASSWORD);
    });
  });

  describe('add', () => {
    it('should call connect, set and disconnect methods with the correct arguments', async () => {
      const key = 'test';
      const value = 'value';
      const revocationDate = new Date(Date.now() + 60000);

      jest.spyOn(cache.client, 'set').mockImplementationOnce(jest.fn())

      await cache.add(key, value, revocationDate);

      expect(cache.client.connect).toHaveBeenCalled();
      expect(cache.client.set).toHaveBeenCalledWith(key, value, { PX: expect.any(Number) });
      expect(cache.client.disconnect).toHaveBeenCalled();
    });
  });

  describe('exists', () => {
    it('should call connect, get and disconnect methods with the correct arguments', async () => {
      const key = 'test';

      jest.spyOn(cache.client, 'get').mockImplementation(() => Promise.resolve('value'));

      const result = await cache.exists(key);

      expect(result).toBe(true);
      expect(cache.client.connect).toHaveBeenCalled();
      expect(cache.client.get).toHaveBeenCalledWith(key);
      expect(cache.client.disconnect).toHaveBeenCalled();
    });

    it('should return false if the key does not exist in the cache', async () => {
      const key = 'non-existing-key';

      jest.spyOn(cache.client, 'get').mockImplementation(() => Promise.resolve(null));

      const result = await cache.exists(key);

      expect(result).toBe(false);
      expect(cache.client.connect).toHaveBeenCalled();
      expect(cache.client.get).toHaveBeenCalledWith(key);
      expect(cache.client.disconnect).toHaveBeenCalled();
    });
  });

  describe('get', () => {
    it('should call connect, get and disconnect methods with the correct arguments', async () => {
      const key = 'test';

      jest.spyOn(cache.client, 'get').mockImplementation(() => Promise.resolve('value'));

      const result = await cache.get(key);

      expect(result).toBe('value');
      expect(cache.client.connect).toHaveBeenCalled();
      expect(cache.client.get).toHaveBeenCalledWith(key);
      expect(cache.client.disconnect).toHaveBeenCalled();
    });

    it('should return null if the key does not exist in the cache', async () => {
      const key = 'non-existing-key';

      jest.spyOn(cache.client, 'get').mockImplementation(() => Promise.resolve(null));

      const result = await cache.get(key);

      expect(result).toBeNull();
      expect(cache.client.connect).toHaveBeenCalled();
      expect(cache.client.get).toHaveBeenCalledWith(key);
      expect(cache.client.disconnect).toHaveBeenCalled();
    });
  });
});

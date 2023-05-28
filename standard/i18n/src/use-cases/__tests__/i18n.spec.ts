import { I18nHandler } from '../i18n';

describe('I18nHandler', () => {
  let i18nHandler: I18nHandler;

  beforeEach(() => {
    i18nHandler = new I18nHandler();
  });

  describe('getMessage', () => {
    it('returns the correct message object for a valid key without any parameters', () => {
      const result = i18nHandler.getMessage('InvalidEnv');
      expect(result.code).toEqual('InvalidEnv');
      expect(result.message).toEqual('Internal error. Invalid environment file');
      expect(result.params).toBeUndefined();
    });

    it('throws an error for an invalid key', () => {
      expect(() => i18nHandler.getMessage('invalidKey')).toThrowError('I18n message invalidKey not found');
    });

    it('uses the supplied locale file if one is provided', () => {
      const localeFile = {
        welcome: 'Bienvenue sur notre application!',
        greetings: 'Bonjour, {name}!',
      };
      const customI18nHandler = new I18nHandler(localeFile);

      const result = customI18nHandler.getMessage('welcome');
      expect(result.code).toEqual('welcome');
      expect(result.message).toEqual('Bienvenue sur notre application!');
      expect(result.params).toBeUndefined();

      const result2 = customI18nHandler.getMessage('greetings', { name: 'Marie' });
      expect(result2.code).toEqual('greetings');
      expect(result2.message).toEqual('Bonjour, Marie!');
      expect(result2.params).toEqual({ name: 'Marie' });
    });
  });
});

import { AccountPolicy } from '../account.policy';
import { AccountProps, AccountRole, AccountStatus } from '..';
import { UUID } from '@find-me/uuid';
import { ValidationError } from '@find-me/errors';

describe('AccountPolicy', () => {
  describe('validateEmail', () => {
    test('should throw an error when email is missing', () => {
      expect(() => AccountPolicy.validateEmail('')).toThrowError('EmailRequired');
    });

    test('should throw an error when email is too short', () => {
      const email = 'x@y.z';
      expect(() => AccountPolicy.validateEmail(email)).toThrowError(ValidationError);
    });

    test('should throw an error when email is too long', () => {
      const email = `${'a'.repeat(253)}@example.com`;
      expect(() => AccountPolicy.validateEmail(email)).toThrowError(ValidationError);
    });

    test('should throw an error when email is invalid', () => {
      const email = 'invalid-email';
      expect(() => AccountPolicy.validateEmail(email)).toThrowError(ValidationError);
    });
  });

  describe('validatePassword', () => {
    test('should throw an error when password is missing', () => {
      expect(() => AccountPolicy.validatePassword('')).toThrowError(ValidationError);
    });

    test('should throw an error when password is too short', () => {
      const password = 'abc';
      expect(() => AccountPolicy.validatePassword(password)).toThrowError(ValidationError);
    });

    test('should throw an error when password is too long', () => {
      const password = 'a'.repeat(31);
      expect(() => AccountPolicy.validatePassword(password)).toThrowError(ValidationError);
    });

    test('should throw an error when password does not contain a number', () => {
      const password = 'aaaaAAAAaaaa#';
      expect(() => AccountPolicy.validatePassword(password)).toThrowError('PasswordNumberRequired');
    });

    test('should throw an error when password does not contain upper and lower case letters', () => {
      const password = '12345aaaa#';
      expect(() => AccountPolicy.validatePassword(password)).toThrowError('PasswordLowerUpperRequired');
    });

    test('should throw an error when password does not contain a special character', () => {
      const password = 'testPassword1';
      expect(() => AccountPolicy.validatePassword(password)).toThrowError('PasswordSpecialRequired');
    });
  });

  describe('validateRole', () => {
    test('should throw an error when role is missing', () => {
      expect(() => AccountPolicy.validateRole(undefined)).toThrowError('RoleRequired');
    });

    test('should throw an error when role is invalid', () => {
      expect(() => AccountPolicy.validateRole({})).toThrowError('RoleInvalid');
    });

    test('should not throw an error when role is valid', () => {
      expect(() => AccountPolicy.validateRole(AccountRole.admin)).not.toThrow();
    });
  });

  describe('validateStatus', () => {
    test('should throw an error when status is missing', () => {
      expect(() => AccountPolicy.validateStatus(undefined)).toThrowError('StatusRequired');
    });

    test('should throw an error when status is invalid', () => {
      expect(() => AccountPolicy.validateStatus({})).toThrowError('StatusInvalid');
    });

    test('should not throw an error when status is valid', () => {
      expect(() => AccountPolicy.validateStatus(AccountStatus.verified)).not.toThrow();
    });
  });

  describe('validate', () => {
    test('should call all validation methods', () => {
      const props: AccountProps = {
        email: 'test@example.com',
        password: 'TestPassword#1',
        role: AccountRole.default,
        status: AccountStatus.unverified,
        person: UUID.generate(),
      };

      const emailSpy = jest.spyOn(AccountPolicy, 'validateEmail');
      const passwordSpy = jest.spyOn(AccountPolicy, 'validatePassword');
      const roleSpy = jest.spyOn(AccountPolicy, 'validateRole');
      const statusSpy = jest.spyOn(AccountPolicy, 'validateStatus');

      AccountPolicy.validate(props);

      expect(emailSpy).toHaveBeenCalledWith('test@example.com');
      expect(passwordSpy).toHaveBeenCalledWith('TestPassword#1');
      expect(roleSpy).toHaveBeenCalledWith(AccountRole.default);
      expect(statusSpy).toHaveBeenCalledWith(AccountStatus.unverified);
    });
  });
});

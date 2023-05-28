import { Guard } from '../guard';
import { ValidationError, ValidationErrorProps } from '@find-me/errors';

describe('Guard', () => {
  describe('required', () => {
    it('should throw a validation error if value is null or empty', () => {
      const error: ValidationErrorProps = { key: 'Value is required' };

      expect(() => Guard.required(null, error)).toThrow(ValidationError);
      expect(() => Guard.required(undefined, error)).toThrow(ValidationError);
      expect(() => Guard.required('', error)).toThrow(ValidationError);
    });

    it('should not throw an error if value is present', () => {
      const error: ValidationErrorProps = { key: 'Value is required' };
      
      expect(() => Guard.required('foobar', error)).not.toThrow();
      expect(() => Guard.required(0, error)).not.toThrow();
      expect(() => Guard.required(false, error)).not.toThrow();
    });
  });

  describe('isUUID', () => {
    it('should not throw an error if value is optional and null', () => {
      expect(() => Guard.isUUID(null, true)).not.toThrow();
    });

    it('should throw a validation error if UUID is invalid', () => {
      const error: ValidationErrorProps = { key: 'Invalid UUID' };

      expect(() => Guard.isUUID('1234')).toThrow(ValidationError);
      expect(() => Guard.isUUID('abc')).toThrow(ValidationError);
      expect(() => Guard.isUUID(undefined, false)).toThrow(ValidationError);
    });

    it('should not throw an error if UUID is valid', () => {
      expect(() => Guard.isUUID('dddcecef-20e9-43e5-8862-c764960232be')).not.toThrow();
      expect(() => Guard.isUUID('a0bdcc50-8f08-11eb-8dcd-0242ac130003')).not.toThrow();
    });
  });

  describe('isDate', () => {
    it('should not throw an error if value is optional and null', () => {
      expect(() => Guard.isDate(null, true)).not.toThrow();
    });

    it('should throw a validation error if date is invalid', () => {
      const error: ValidationErrorProps = { key: 'Invalid date' };

      expect(() => Guard.isDate('2021-45-34')).toThrow(ValidationError);
      expect(() => Guard.isDate('foobar')).toThrow(ValidationError);
    });

    it('should not throw an error if date is valid', () => {
      expect(() => Guard.isDate('2021-04-15')).not.toThrow();
      expect(() => Guard.isDate(new Date())).not.toThrow();
    });
  });

  describe('isString', () => {
    it('should not throw an error if value is optional and null', () => {
      const error: ValidationErrorProps = { key: 'Value must be a string' };

      expect(() => Guard.isString(null, error, true)).not.toThrow();
    });

    it('should throw a validation error if value is not a string', () => {
      const error: ValidationErrorProps = { key: 'Value must be a string' };

      expect(() => Guard.isString(123, error)).toThrow(ValidationError);
      expect(() => Guard.isString(true, error)).toThrow(ValidationError);
    });

    it('should not throw an error if value is a string', () => {
      const error: ValidationErrorProps = { key: 'Value must be a string' };
      
      expect(() => Guard.isString('foobar', error)).not.toThrow();
      expect(() => Guard.isString('', error, true)).not.toThrow();
    });

    it('should throw a validation error if string length is out of bounds', () => {
      const error: ValidationErrorProps = { key: 'Invalid string length' };
      const options = { min: 2, max: 5 };

      expect(() => Guard.stringLength('a', options, error)).toThrow(ValidationError);
      expect(() => Guard.stringLength('foobar', options, error)).toThrow(ValidationError);
    });

    it('should not throw an error if string length is within bounds', () => {
      const error: ValidationErrorProps = { key: 'Invalid string length' };
      const options = { min: 2, max: 5 };

      expect(() => Guard.stringLength('ab', options, error)).not.toThrow();
      expect(() => Guard.stringLength('abcde', options, error)).not.toThrow();
    });
  });

  describe('isNumber', () => {
    it('should not throw an error if value is optional and null', () => {
      const error: ValidationErrorProps = { key: 'Value must be a number' };

      expect(() => Guard.isNumber(null, error, true)).not.toThrow();
    });

    it('should throw a validation error if value is not a number', () => {
      const error: ValidationErrorProps = { key: 'Value must be a number' };

      expect(() => Guard.isNumber('123', error)).toThrow(ValidationError);
      expect(() => Guard.isNumber(true, error)).toThrow(ValidationError);
    });

    it('should not throw an error if value is a number', () => {
      const error: ValidationErrorProps = { key: 'Value must be a number' };

      expect(() => Guard.isNumber(123, error)).not.toThrow();
      expect(() => Guard.isNumber(0, error)).not.toThrow();
      expect(() => Guard.isNumber(-1.23, error)).not.toThrow();
    });
  });

  describe('isBoolean', () => {
    it('should not throw an error if value is optional and null', () => {
      const error: ValidationErrorProps = { key: 'Value must be a boolean' };

      expect(() => Guard.isBoolean(null, error, true)).not.toThrow();
    });

    it('should throw a validation error if value is not a boolean', () => {
      const error: ValidationErrorProps = { key: 'Value must be a boolean' };

      expect(() => Guard.isBoolean('invalid', error)).toThrow(ValidationError);
      expect(() => Guard.isBoolean(123, error)).toThrow(ValidationError);
    });

    it('should not throw an error if value is a boolean', () => {
      const error: ValidationErrorProps = { key: 'Value must be a boolean' };

      expect(() => Guard.isBoolean(true, error)).not.toThrow();
      expect(() => Guard.isBoolean(false, error)).not.toThrow();
      expect(() => Guard.isBoolean('true', error)).not.toThrow();
      expect(() => Guard.isBoolean('false', error)).not.toThrow();
    });
  });
});

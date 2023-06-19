import { DateVO } from '@find-me/date';
import { PersonPolicy } from '../person.policy';
import { ValidationError } from '@find-me/errors';

const MIN_AGE = 13;
const MAX_AGE = 116;

const NAME_MAX_LENGTH = 50;

describe('PersonPolicy', () => {
  describe('validateBirthDate', () => {
    it('should throw an error if birthDate is not provided', () => {
      expect(() => {
        PersonPolicy.validateBirthDate(null);
      }).toThrowError(ValidationError);
    });

    it('should throw an error if age is lower than MIN_AGE', () => {
      const birthDate = DateVO.now().subYears(MIN_AGE - 1)
      expect(() => {
        PersonPolicy.validateBirthDate(birthDate);
      }).toThrowError(ValidationError);
    });

    it('should throw an error if age is greater than MAX_AGE', () => {
      const birthDate = DateVO.now().subYears(MAX_AGE + 1);
      expect(() => {
        PersonPolicy.validateBirthDate(birthDate);
      }).toThrowError(ValidationError);
    });

    it('should not throw an error if age is between MIN_AGE and MAX_AGE', () => {
      const birthDate = DateVO.now().subYears(MIN_AGE + 1);
      expect(() => {
        PersonPolicy.validateBirthDate(birthDate);
      }).not.toThrow();
    });
  });

  describe('validateName', () => {
    it('should throw an error if name is not provided', () => {
      expect(() => {
        PersonPolicy.validateName(null);
      }).toThrowError(ValidationError);
    });

    it('should throw an error if name length is shorter than NAME_MIN_LENGTH', () => {
      const name = 'ab';
      expect(() => {
        PersonPolicy.validateName(name);
      }).toThrowError(ValidationError);
    });

    it('should throw an error if name length is longer than NAME_MAX_LENGTH', () => {
      const name = 'a'.repeat(NAME_MAX_LENGTH + 1);
      expect(() => {
        PersonPolicy.validateName(name);
      }).toThrowError(ValidationError);
    });

    it('should throw an error if name does not match NAME_REGEX', () => {
      const name = 'john-doe';
      expect(() => {
        PersonPolicy.validateName(name);
      }).toThrowError(ValidationError);
    });

    it('should not throw an error if name is valid', () => {
      const name = 'John Doe';
      expect(() => {
        PersonPolicy.validateName(name);
      }).not.toThrow();
    });
  });

  describe('validate', () => {
    it('should call validateBirthDate and validateName with the correct props', () => {
      const validateBirthDateSpy = jest.spyOn(PersonPolicy, 'validateBirthDate');
      const validateNameSpy = jest.spyOn(PersonPolicy, 'validateName');
      const props = { name: 'John Doe', birthDate: new DateVO(new Date(Date.now() - (50 * 365 * 24 * 60 * 60 * 1000))) };
      PersonPolicy.validate(props);
      expect(validateBirthDateSpy).toHaveBeenCalledWith(props.birthDate);
      expect(validateNameSpy).toHaveBeenCalledWith(props.name);
    });
  });
});

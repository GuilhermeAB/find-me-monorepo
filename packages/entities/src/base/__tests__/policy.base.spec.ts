import { ValidationError } from '@find-me/errors';
import { Policy } from '../policy.base';
import { DateVO } from '@find-me/date';

describe('Policy', () => {
  describe('matchRegex', () => {
    test('should return true if value matches regex', () => {
      // Arrange
      const regex = /^[a-zA-Z]+$/; // Matches alphabetical characters only

      class TestPolicy extends Policy {
        public static validate(value: string, regex: RegExp): boolean {
          return Policy.matchRegex(value, regex);
        }
      }

      // Act
      const result = TestPolicy.validate('John', regex);

      // Assert
      expect(result).toBe(true);
    });

    test('should return false if value does not match regex', () => {
      // Arrange
      const regex = /^[a-zA-Z]+$/; // Matches alphabetical characters only

      class TestPolicy extends Policy {
        public static validate(value: string, regex: RegExp): boolean {
          return Policy.matchRegex(value, regex);
        }
      }

      // Act
      const result = TestPolicy.validate('123', regex);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('lengthIsBetween', () => {
    test('should return true if length is between min and max values', () => {
      class TestPolicy extends Policy {
        public static validate(value: string | number, min: number, max: number): boolean {
          return Policy.lengthIsBetween(value, min, max);
        }
      }

      // Act
      const result = TestPolicy.validate('12345', 3, 6);

      // Assert
      expect(result).toBe(true);
    });

    test('should return false if length is less than min value', () => {
      class TestPolicy extends Policy {
        public static validate(value: string | number, min: number, max: number): boolean {
          return Policy.lengthIsBetween(value, min, max);
        }
      }

      // Act
      const result = TestPolicy.validate('12', 3, 6);

      // Assert
      expect(result).toBe(false);
    });

    test('should return false if length is greater than max value', () => {
      class TestPolicy extends Policy {
        public static validate(value: string | number, min: number, max: number): boolean {
          return Policy.lengthIsBetween(value, min, max);
        }
      }

      // Act
      const result = TestPolicy.validate('1234567', 3, 6);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('ageIsBetween', () => {
    test('should return true if age is between min and max values', () => {
      // Arrange
      const birthDate = new DateVO('1990-01-01T00:00:00Z');
      const now = new DateVO('2022-01-01T00:00:00Z');
      jest.spyOn(DateVO, 'now').mockImplementation(() => now);

      class TestPolicy extends Policy {
        public static validate(value: DateVO | Date, min: number, max: number): boolean {
          return Policy.ageIsBetween(value, min, max);
        }
      }

      // Act
      const result = TestPolicy.validate(birthDate, 18, 65);

      // Assert
      expect(result).toBe(true);
    });

    test('should return false if age is less than min value', () => {
      // Arrange
      const birthDate = new DateVO('2005-01-01T00:00:00Z');
      const now = new DateVO('2022-01-01T00:00:00Z');
      jest.spyOn(DateVO, 'now').mockImplementation(() => now);

      class TestPolicy extends Policy {
        public static validate(value: DateVO | Date, min: number, max: number): boolean {
          return Policy.ageIsBetween(value, min, max);
        }
      }

      // Act
      const result = TestPolicy.validate(birthDate, 18, 65);

      // Assert
      expect(result).toBe(false);
    });

    test('should return false if age is greater than max value', () => {
      // Arrange
      const birthDate = new DateVO('1950-01-01T00:00:00Z');
      const now = new DateVO('2022-01-01T00:00:00Z');
      jest.spyOn(DateVO, 'now').mockImplementation(() => now);

      class TestPolicy extends Policy {
        public static validate(value: DateVO | Date, min: number, max: number): boolean {
          return Policy.ageIsBetween(value, min, max);
        }
      }

      // Act
      const result = TestPolicy.validate(birthDate, 18, 65);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('error', () => {
    it('should throw a ValidationError with the given props', () => {
      const errorProps = { key: 'InvalidInput' };

      class TestPolicy extends Policy {
        public static validate(): void {
          TestPolicy.error(errorProps);
        }
      }
      
      expect(() => {
        TestPolicy.validate();
      }).toThrowError(ValidationError);
      
      try {
        TestPolicy.validate();
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).key).toEqual(errorProps.key);
      }
    });
  });
});

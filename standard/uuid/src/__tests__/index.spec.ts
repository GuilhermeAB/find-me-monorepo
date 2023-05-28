import { v4 as uuidV4 } from 'uuid';
import { UUID } from '..';
import { ValidationError } from '@find-me/errors';

describe('UUID class', () => {
  describe('constructor', () => {
    it('should create a valid UUID instance with the provided value', () => {
      const uuid = new UUID(uuidV4());

      expect(uuid.value).toBeDefined();
      expect(typeof uuid.value).toBe('string');

      expect(() => {
        UUID.validate(uuid.value);
      }).not.toThrowError();
    });

    it('should throw a ValidationError when an invalid value is provided', () => {
      expect(() => {
        new UUID('invalid_uuid');
      }).toThrowError(new ValidationError({ key: 'InvalidId' }));
    });
  });

  describe('generate static method', () => {
    it('should return a new UUID instance when a string value is provided', () => {
      const uuidStr = uuidV4();
      const uuid = UUID.generate(uuidStr);

      expect(uuid.value).toBe(uuidStr);
      expect(uuid instanceof UUID).toBe(true);
    });

    it('should return the same UUID instance when a UUID object is provided', () => {
      const uuid1 = new UUID(uuidV4());
      const uuid2 = UUID.generate(uuid1);

      expect(uuid2).toBe(uuid1);
    });

    it('should generate a new UUID instance when no value is provided', () => {
      const uuid = UUID.generate();

      expect(uuid.value).toBeDefined();
      expect(typeof uuid.value).toBe('string');
    });

    it('should throw a ValidationError when an invalid value is generated', () => {
      const uuidStr = 'invalid_uuid';

      expect(() => {
        UUID.generate(uuidStr);
      }).toThrowError(new ValidationError({ key: 'InvalidId' }));
    });
  });

  describe('validate static method', () => {
    it('should not throw a ValidationError when a valid value is provided', () => {
      const uuidStr = uuidV4();

      expect(() => {
        UUID.validate(uuidStr);
      }).not.toThrowError();
    });

    it('should throw a ValidationError when an invalid value is provided', () => {
      const uuidStr = 'invalid_uuid';

      expect(() => {
        UUID.validate(uuidStr);
      }).toThrowError(new ValidationError({ key: 'InvalidId' }));
    });
  });
});
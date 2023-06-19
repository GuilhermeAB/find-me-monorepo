import { DateVO } from '@find-me/date';
import { PersonEntity } from '../person.entity';

describe('PersonEntity', () => {
  describe('create', () => {
    it('should create a new PersonEntity instance with trimmed name and proper birthDate', () => {
      const create = { name: '   John Doe    ', birthDate: '1990-01-01T00:00:00.000Z' };
      const person = PersonEntity.create(create);
      expect(person).toBeInstanceOf(PersonEntity);
      expect(person.getProps().name).toEqual('John Doe');
      expect(person.getProps().birthDate).toEqual(new DateVO(new Date('1990-01-01T00:00:00.000Z')));
    });

    it('should call validate method on the created entity', () => {
      const create = { name: 'John Doe', birthDate: '1990-01-01T00:00:00.000Z' };
      const validateSpy = jest.spyOn(PersonEntity.prototype, 'validate');
      const person = PersonEntity.create(create);
      expect(validateSpy).toHaveBeenCalled();
    });
  });

  describe('validate', () => {
    it('should throw an error if props are invalid', () => {
      const props = { name: '', birthDate: null };
      const person = new PersonEntity({ props });
      expect(() => {
        person.validate();
      }).toThrow();
    });

    it('should not throw an error if props are valid', () => {
      const props = { name: 'John Doe', birthDate: new DateVO(new Date(Date.now() - (30 * 365 * 24 * 60 * 60 * 1000))) };
      const person = new PersonEntity({ props });
      expect(() => {
        person.validate();
      }).not.toThrow();
    });
  })
});

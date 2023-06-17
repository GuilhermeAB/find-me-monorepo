import { ValidationError } from '@find-me/errors';
import { AlertPersonEntityType } from '..';
import { AlertPersonPolicy } from '../alert-person.policy';
import { AlertLocationType, AlertStatus, AlertTypeEnum } from '../../base';
import { DateVO } from '@find-me/date';
import { UUID } from '@find-me/uuid';

describe('AlertPersonPolicy', () => {
  describe('validatePDC', () => {
    it('should throw an error if value is undefined', () => {
      expect(() => AlertPersonPolicy.validatePDC(undefined)).toThrowError(ValidationError);
    });

    it('should not throw an error if value is a boolean', () => {
      expect(() => AlertPersonPolicy.validatePDC(true)).not.toThrow();
      expect(() => AlertPersonPolicy.validatePDC(false)).not.toThrow();
    });

    it('should throw an error if value is not a boolean', () => {
      expect(() => AlertPersonPolicy.validatePDC(null)).toThrowError(ValidationError);
      expect(() => AlertPersonPolicy.validatePDC(123)).toThrowError(ValidationError);
      expect(() => AlertPersonPolicy.validatePDC('true')).toThrowError(ValidationError);
    });
  });

  describe('validate', () => {
    it('should call validatePDC with info.isPCD', () => {
      const props: AlertPersonEntityType = {
        id: UUID.generate(),
        type: AlertTypeEnum.Person,
        birthDate: new DateVO('1990-01-01'),
        disappearDate: new DateVO('2021-01-01'),
        name: 'John Smith',
        description: 'Lorem ipsum dolor sit',
        location: {
          type: AlertLocationType.Point,
          coordinates: [180, 90],
        },
        info: {
          isPCD: true,
        },
        account: UUID.generate(),
        status: AlertStatus.Open,
      };

      jest.spyOn(AlertPersonPolicy, 'validatePDC');

      AlertPersonPolicy.validate(props);

      expect(AlertPersonPolicy.validatePDC).toHaveBeenCalledWith(true);
    });
  });
});

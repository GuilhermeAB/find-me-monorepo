import { DateVO } from '@find-me/date';
import { AlertLocationType, AlertTypeEnum, CreateAlertProps } from '../alert-base.entity';
import { AlertPolicy } from '../alert-base.policy';
import { AlertEntityType } from '..';
import { ValidationError } from '@find-me/errors';

describe('AlertPolicy', () => {
  describe('validateType', () => {
    it('should throw an error if type is undefined', () => {
      expect(() => {
        AlertPolicy.validateType(undefined);
      }).toThrowError(ValidationError);
    });

    it('should throw an error if type is not valid', () => {
      expect(() => {
        AlertPolicy.validateType('invalid-type');
      }).toThrowError(ValidationError);
    });

    it('should not throw an error if type is valid', () => {
      expect(() => {
        AlertPolicy.validateType(AlertTypeEnum.Person);
      }).not.toThrow();
    });
  });

  describe('validateAge', () => {
    it('should throw an error if birthDate is undefined', () => {
      expect(() => {
        AlertPolicy.validateAge(undefined);
      }).toThrowError(ValidationError);
    });

    it('should throw an error if birthDate is invalid', () => {
      expect(() => {
        AlertPolicy.validateAge(new DateVO('3000-01-01'));
      }).toThrowError(ValidationError);
    });

    it('should not throw an error if birthDate is valid', () => {
      const today = new Date();
      const birthDate = new Date(today.getFullYear() - 30, today.getMonth(), today.getDate());
      const dateVO = new DateVO(birthDate);

      expect(() => {
        AlertPolicy.validateAge(dateVO);
      }).not.toThrow();
    });
  });

  describe('validateDisappearDate', () => {
    it('should throw an error if disappearDate is undefined', () => {
      expect(() => {
        AlertPolicy.validateDisappearDate(undefined);
      }).toThrowError(ValidationError);
    });

    it('should throw an error if disappearDate is invalid', () => {
      const dateVO = new DateVO(DateVO.now().addYears(1));

      expect(() => {
        AlertPolicy.validateDisappearDate(dateVO);
      }).toThrowError(ValidationError);
    });

    it('should not throw an error if disappearDate is valid', () => {
      const dateVO = new DateVO(DateVO.now().addYears(-1));

      expect(() => {
        AlertPolicy.validateDisappearDate(dateVO);
      }).not.toThrow();
    });
  });

  describe('validateName', () => {
    it('should throw an error if name is undefined', () => {
      expect(() => {
        AlertPolicy.validateName(undefined);
      }).toThrowError(ValidationError);
    });

    it('should throw an error if name is too short', () => {
      expect(() => {
        AlertPolicy.validateName('Jo');
      }).toThrowError(ValidationError);
    });

    it('should throw an error if name is too long', () => {
      const longName = 'a'.repeat(51);

      expect(() => {
        AlertPolicy.validateName(longName);
      }).toThrowError(ValidationError);
    });

    it('should throw an error if name is invalid', () => {
      expect(() => {
        AlertPolicy.validateName('INVALID NAME');
      }).toThrowError(ValidationError);
    });

    it('should not throw an error if name is valid', () => {
      expect(() => {
        AlertPolicy.validateName('John Smith');
      }).not.toThrow();
    });
  });

  describe('validateDescription', () => {
    it('should throw an error if description is undefined', () => {
      expect(() => {
        AlertPolicy.validateDescription(undefined);
      }).toThrowError(ValidationError);
    });

    it('should throw an error if description is too short', () => {
      expect(() => {
        AlertPolicy.validateDescription('Jo');
      }).toThrowError(ValidationError);
    });

    it('should throw an error if description is too long', () => {
      const longName = 'a'.repeat(401);

      expect(() => {
        AlertPolicy.validateDescription(longName);
      }).toThrowError(ValidationError);
    });

    it('should not throw an error if description is valid', () => {
      expect(() => {
        AlertPolicy.validateDescription('Lorem ipsum dolor sit');
      }).not.toThrow();
    });
  });

  describe('validateLatitude', () => {
    it('should throw an error if latitude is not provided', () => {
      expect(() => AlertPolicy.validateLatitude(null)).toThrowError('LatitudeRequired');
    });

    it('should throw an error if latitude is not a number', () => {
      expect(() => AlertPolicy.validateLatitude('test')).toThrowError('LatitudeInvalid');
    });

    it('should throw an error if latitude is less than -90', () => {
      expect(() => AlertPolicy.validateLatitude('-91')).toThrowError('LatitudeInvalid');
    });

    it('should throw an error if latitude is greater than 90', () => {
      expect(() => AlertPolicy.validateLatitude('91')).toThrowError('LatitudeInvalid');
    });

    it('should not throw an error if latitude is valid', () => {
      expect(() => AlertPolicy.validateLatitude('0')).not.toThrow();
    });
  });

  describe('validateLongitude', () => {
    it('should throw an error if longitude is not provided', () => {
      expect(() => AlertPolicy.validateLongitude(undefined)).toThrowError('LongitudeRequired');
    });

    it('should throw an error if longitude is not a number', () => {
      expect(() => AlertPolicy.validateLongitude('test')).toThrowError('LongitudeInvalid');
    });

    it('should throw an error if longitude is less than -180', () => {
      expect(() => AlertPolicy.validateLongitude('-181')).toThrowError('LongitudeInvalid');
    });

    it('should throw an error if longitude is greater than 180', () => {
      expect(() => AlertPolicy.validateLongitude('181')).toThrowError('LongitudeInvalid');
    });

    it('should not throw an error if longitude is valid', () => {
      expect(() => AlertPolicy.validateLongitude('0')).not.toThrow();
    });
  });

  describe('validate', () => {
    it('should call all validation methods', () => {
      const props: CreateAlertProps<undefined> = {
        type: AlertTypeEnum.Person,
        birthDate: new DateVO('1990-01-01'),
        disappearDate: new DateVO('2021-01-01'),
        name: 'John Smith',
        description: 'Lorem ipsum dolor sit',
        location: {
          type: AlertLocationType.Point,
          coordinates: [180, 90],
        },
        info: undefined,
      };

      jest.spyOn(AlertPolicy, 'validateType').mockImplementation(jest.fn());
      jest.spyOn(AlertPolicy, 'validateAge').mockImplementation(jest.fn());
      jest.spyOn(AlertPolicy, 'validateDisappearDate').mockImplementation(jest.fn());
      jest.spyOn(AlertPolicy, 'validateName').mockImplementation(jest.fn());
      jest.spyOn(AlertPolicy, 'validateLatitude').mockImplementation(jest.fn());
      jest.spyOn(AlertPolicy, 'validateLongitude').mockImplementation(jest.fn());

      AlertPolicy.validate(props as AlertEntityType);

      expect(AlertPolicy.validateType).toHaveBeenCalledWith(props.type);
      expect(AlertPolicy.validateAge).toHaveBeenCalledWith(props.birthDate);
      expect(AlertPolicy.validateDisappearDate).toHaveBeenCalledWith(props.disappearDate);
      expect(AlertPolicy.validateName).toHaveBeenCalledWith(props.name);
      expect(AlertPolicy.validateLatitude).toHaveBeenCalledWith(props.location.coordinates[1]);
      expect(AlertPolicy.validateLongitude).toHaveBeenCalledWith(props.location.coordinates[0]);
    });
  });
});

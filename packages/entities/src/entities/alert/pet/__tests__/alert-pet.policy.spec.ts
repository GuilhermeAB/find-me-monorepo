import { ValidationError } from '@find-me/errors';
import { UUID } from '@find-me/uuid';
import { DateVO } from '@find-me/date';
import { AlertPetEntityType, PetType } from '..';
import { AlertPetPolicy } from '../alert-pet.policy';
import { AlertLocationType, AlertStatus, AlertTypeEnum } from '../../base';

describe('AlertPetPolicy', () => {
  describe('validatePetType', () => {
    it('should throw error if value is undefined', () => {
      expect(() => AlertPetPolicy.validatePetType(undefined)).toThrowError(ValidationError);
    });

    it('should throw error if value is not a valid PetType', () => {
      expect(() => AlertPetPolicy.validatePetType('invalidPetType' as PetType)).toThrowError(ValidationError);
    });

    it('should not throw error if value is a valid PetType', () => {
      expect(() => AlertPetPolicy.validatePetType(PetType.Cat)).not.toThrow();
    });
  });

  describe('validate', () => {
    it('should call validatePetType with correct argument', () => {
      const validatePetTypeMock = jest.spyOn(AlertPetPolicy, 'validatePetType');
      const props: AlertPetEntityType = {
        id: UUID.generate(),
        type: AlertTypeEnum.Pet,
        birthDate: new DateVO('1990-01-01'),
        disappearDate: new DateVO('2021-01-01'),
        name: 'John Smith',
        description: 'Lorem ipsum dolor sit',
        location: {
          type: AlertLocationType.Point,
          coordinates: [180, 90],
        },
        info: {
          petType: PetType.Cat,
        },
        account: UUID.generate(),
        status: AlertStatus.Open,
      };

      AlertPetPolicy.validate(props);
      expect(validatePetTypeMock).toHaveBeenCalledWith(props.info.petType);
    });
  });
});

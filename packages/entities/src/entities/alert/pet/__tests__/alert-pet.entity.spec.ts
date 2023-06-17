import { DateVO } from '@find-me/date';
import { AlertPetEntity, PetType } from '..';
import { AlertLocationType, AlertStatus, AlertTypeEnum } from '../../base';
import { AlertPetPolicy } from '../alert-pet.policy';
import { UUID } from '@find-me/uuid';

describe('AlertPetEntity', () => {
  test('create method should create an AlertPetEntity instance', () => {
    const birthDate = new DateVO(new Date(2010, 1, 1).toISOString());
    const disappearDate = new DateVO(new Date().toISOString());

    const entity = AlertPetEntity.create({
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
    });

    expect(entity).toBeInstanceOf(AlertPetEntity);
    expect(entity.getProps().info.petType).toBe(PetType.Cat);
  });

  test('validatePet method should call AlertPetPolicy validate method with entity props', () => {
    // Create a spy for the validate method of AlertPetPolicy
    const validateSpy = jest.spyOn(AlertPetPolicy, 'validate');

    const entity = AlertPetEntity.create({
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
    });

    // Call the validatePet method of the entity
    entity['validatePet']();

    // Expect that the validate method was called with the correct arguments
    expect(validateSpy).toHaveBeenCalledWith(entity.getProps());

    // Restore the original implementation of the validate method
    validateSpy.mockRestore();
  });
});
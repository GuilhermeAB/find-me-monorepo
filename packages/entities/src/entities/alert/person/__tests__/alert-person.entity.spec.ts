import { DateVO } from '@find-me/date';
import { AlertPersonEntity } from '..';
import { AlertLocationType, AlertTypeEnum } from '../../base';
import { AlertPersonPolicy } from '../alert-person.policy';
import { UUID } from '@find-me/uuid';

describe('AlertPersonEntity', () => {
  test('create method should create an AlertPersonEntity instance', () => {
    const birthDate = new DateVO(new Date(2010, 1, 1).toISOString());
    const disappearDate = new DateVO(new Date().toISOString());

    const entity = AlertPersonEntity.create({
      type: AlertTypeEnum.Person,
      name: 'John Doe',
      description: 'Lorem ipsum dolor sit',
      birthDate,
      disappearDate,
      location: {
        type: AlertLocationType.Point,
        coordinates: [180, 90],
      },
      info: {
        isPCD: true,
      },
      account: UUID.generate('503130bb-a450-40d3-a95d-e1913d33f417'),
    });

    expect(entity).toBeInstanceOf(AlertPersonEntity);
    expect(entity.getProps().info.isPCD).toBe(true);
  });

  test('validatePerson method should call AlertPersonPolicy validate method with entity props', () => {
    // Create a spy for the validate method of AlertPersonPolicy
    const validateSpy = jest.spyOn(AlertPersonPolicy, 'validate');

    // Create an AlertPersonEntity instance
    const birthDate = new DateVO(new Date(2010, 1, 1).toISOString());
    const disappearDate = new DateVO(new Date().toISOString());

    const entity = AlertPersonEntity.create({
      type: AlertTypeEnum.Person,
      name: 'John Doe',
      description: 'Lorem ipsum dolor sit',
      birthDate,
      disappearDate,
      location: {
        type: AlertLocationType.Point,
        coordinates: [180, 90],
      },
      info: {
        isPCD: false,
      },
      account: UUID.generate('503130bb-a450-40d3-a95d-e1913d33f417'),
    });

    // Call the validatePerson method of the entity
    entity['validatePerson']();

    // Expect that the validate method was called with the correct arguments
    expect(validateSpy).toHaveBeenCalledWith(entity.getProps());

    // Restore the original implementation of the validate method
    validateSpy.mockRestore();
  });
});
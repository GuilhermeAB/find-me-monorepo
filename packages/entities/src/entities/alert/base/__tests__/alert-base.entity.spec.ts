import { DateVO } from '@find-me/date';
import { Entity } from '../../../../base';
import { AlertEntity, AlertLocationType, AlertTypeEnum } from '..';

describe('AlertEntity', () => {
  describe('create', () => {
    it('should create a new AlertEntity instance', () => {
      const birthDate = new DateVO(new Date(2010, 1, 1).toISOString());
      const disappearDate = new DateVO(new Date().toISOString());

      const alertEntity = AlertEntity.new<unknown>({
        type: AlertTypeEnum.Person,
        name: 'John Doe',
        description: 'Lorem ipsum dolor sit',
        birthDate,
        disappearDate,
        location: {
          type: AlertLocationType.Point,
          coordinates: [180, 90],
        },
        info: undefined,
      });

      expect(alertEntity).toBeInstanceOf(Entity);
      expect(alertEntity.getProps()).toEqual({
        type: AlertTypeEnum.Person,
        name: 'John Doe',
        description: 'Lorem ipsum dolor sit',
        birthDate,
        disappearDate,
        location: {
          type: AlertLocationType.Point,
          coordinates: [180, 90],
        },
        info: undefined,
        id: expect.anything(),
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
    });

    it('should throw an error if given invalid props', () => {
      const birthDate = new DateVO(new Date().toISOString());
      const disappearDate = new DateVO(new Date(2022, 1, 1).toISOString());

      expect(() => AlertEntity.new<unknown>({
        type: AlertTypeEnum.Pet,
        name: '',
        description: '',
        birthDate,
        disappearDate,
        location: {
          type: AlertLocationType.Point,
          coordinates: [180, 90],
        },
        info: undefined,
      })).toThrow();
    });
  });

  describe('validate', () => {
    it('should not throw an error if the entity is valid', () => {
      const birthDate = new DateVO(new Date(2010, 1, 1).toISOString());
      const disappearDate = new DateVO(new Date().toISOString());

      const alertEntity = new AlertEntity<unknown>({
        props: {
          type: AlertTypeEnum.Person,
          name: 'John Doe',
          description: 'Lorem ipsum dolor sit',
          birthDate,
          disappearDate,
          location: {
            type: AlertLocationType.Point,
            coordinates: [180, 90],
          },
          info: undefined,
        },
      });

      expect(() => alertEntity.validate()).not.toThrow();
    });

    it('should throw an error if the entity is invalid', () => {
      const birthDate = new DateVO(new Date().toISOString());
      const disappearDate = new DateVO(new Date(2022, 1, 1).toISOString());

      const alertEntity = new AlertEntity<unknown>({
        props: {
          type: AlertTypeEnum.Pet,
          name: '',
          description: '',
          birthDate,
          disappearDate,
          location: {
            type: AlertLocationType.Point,
            coordinates: [180, 90],
          },
          info: undefined,
        },
      });

      expect(() => alertEntity.validate()).toThrow();
    });
  });
});

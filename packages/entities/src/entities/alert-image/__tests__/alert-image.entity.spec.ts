import { UUID } from '@find-me/uuid';
import { AlertImageEntity, CreateAlertImageProps } from '../alert-image.entity';

describe('AlertImageEntity', () => {
  let props: CreateAlertImageProps;

  beforeEach(() => {
    props = {
      alert: UUID.generate(),
      width: 100,
      height: 100,
      size: 1000,
      type: 'webp',
    };
  });

  describe('create', () => {
    it('should create a new AlertImageEntity with correct props', () => {
      const entity = AlertImageEntity.create(props);
      expect(entity).toBeInstanceOf(AlertImageEntity);
      expect(entity.getProps()).toEqual({
        id: expect.anything(),
        width: 100,
        height: 100,
        size: 1000,
        type: 'webp',
        alert: UUID.generate(props.alert),
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
    });
  });
});

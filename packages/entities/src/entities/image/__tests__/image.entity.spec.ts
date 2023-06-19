import { UUID } from '@find-me/uuid';
import { ImageEntity, ImageType } from '../image.entity';
import { ImagePolicy } from '../image.policy';

describe('ImageEntity', () => {
  describe('new', () => {
    it('should create a new ImageEntity with the correct props', () => {
      const createProps = { id: UUID.generate(), type: ImageType.Webp, width: 100, height: 100, size: 100 };
      const entity = ImageEntity.new(createProps);
      expect(entity).toBeInstanceOf(ImageEntity);
      expect(entity.getProps()).toEqual({
        ...createProps,
        type: ImageType.Webp,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
    });

    it('should create a new ImageEntity with the given id', () => {
      const id = UUID.generate();
      const createProps = { id, type: ImageType.Webp, width: 100, height: 100, size: 100 };
      const entity = ImageEntity.new(createProps, id);
      expect(entity.getProps().id.value).toEqual(id.value);
    });
  });

  describe('validate', () => {
    it('should call ImagePolicy.validate with the correct props', () => {
      const validateSpy = jest.spyOn(ImagePolicy, 'validate');
      const props = { id: UUID.generate(), type: ImageType.Webp, width: 100, height: 100, size: 100 };
      const entity = new ImageEntity({ props, timestamps: true });
      entity.validate();
      expect(validateSpy).toHaveBeenCalledWith({
        ...props,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      }, undefined);
    });

    it('should call ImagePolicy.validate with maxSize when provided', () => {
      const validateSpy = jest.spyOn(ImagePolicy, 'validate');
      const props = { id: UUID.generate(), type: ImageType.Webp, width: 100, height: 100, size: 100 };
      const entity = new ImageEntity({ props, timestamps: true });
      const maxSize = 512000;
      entity.validate(maxSize);
      expect(validateSpy).toHaveBeenCalledWith({
        ...props,
        id: expect.anything(),
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      }, maxSize);
    });
  });
});

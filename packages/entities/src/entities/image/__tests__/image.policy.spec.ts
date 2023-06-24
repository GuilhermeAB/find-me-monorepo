import { ValidationError } from '@find-me/errors';
import { ImageType } from '../image.entity';
import { ImagePolicy } from '../image.policy';
import { UUID } from '@find-me/uuid';

describe('ImagePolicy', () => {
  describe('validateType', () => {
    it('should not throw an error when given a valid type', () => {
      expect(() => ImagePolicy.validateType(ImageType.Webp)).not.toThrow();
    });

    it('should throw an error when given an empty type', () => {
      expect(() => ImagePolicy.validateType('')).toThrowError(ValidationError);
    });

    it('should throw an error when given an invalid type', () => {
      const invalidType = 'invalid type';
      expect(() => ImagePolicy.validateType(invalidType)).toThrowError(ValidationError);
    });
  });

  describe('validateWidth', () => {
    it('should not throw an error when given a valid width', () => {
      const validWidth = 100;
      expect(() => ImagePolicy.validateWidth(validWidth)).not.toThrow();
    });

    it('should throw an error when given an empty width', () => {
      expect(() => ImagePolicy.validateWidth('')).toThrowError(ValidationError);
    });

    it('should throw an error when given an invalid width', () => {
      const invalidWidth = 'invalid width';
      expect(() => ImagePolicy.validateWidth(invalidWidth)).toThrowError(ValidationError);
    });
  });

  describe('validateHeight', () => {
    it('should not throw an error when given a valid height', () => {
      const validHeight = 100;
      expect(() => ImagePolicy.validateHeight(validHeight)).not.toThrow();
    });

    it('should throw an error when given an empty height', () => {
      expect(() => ImagePolicy.validateHeight('')).toThrowError(ValidationError);
    });

    it('should throw an error when given an invalid height', () => {
      const invalidHeight = 'invalid height';
      expect(() => ImagePolicy.validateHeight(invalidHeight)).toThrowError(ValidationError);
    });
  });

  describe('validateSize', () => {
    it('should not throw an error when given a valid size', () => {
      const validSize = 100;
      expect(() => ImagePolicy.validateSize(validSize)).not.toThrow();
    });

    it('should not throw an error when size < max size', () => {
      const validSize = 1024;
      expect(() => ImagePolicy.validateSize(validSize, 2048)).not.toThrow();
    });

    it('should throw an error when given an empty size', () => {
      expect(() => ImagePolicy.validateSize('')).toThrowError(ValidationError);
    });

    it('should throw an error when given an invalid size', () => {
      const invalidSize = 'invalid size';
      expect(() => ImagePolicy.validateSize(invalidSize)).toThrowError(ValidationError);
    });

    it('should throw an error when the size exceeds maxSize', () => {
      const maxSize = 512000; // 500KB
      const largeSize = (maxSize + 1).toString();
      expect(() => ImagePolicy.validateSize(largeSize, maxSize)).toThrowError(ValidationError);
    });
  });

  describe('validate', () => {
    it('should call all validation methods with the correct props', () => {
      const props = { id: UUID.generate(), type: ImageType.Webp, width: 100, height: 100, size: 100 };
      jest.spyOn(ImagePolicy, 'validateType');
      jest.spyOn(ImagePolicy, 'validateWidth');
      jest.spyOn(ImagePolicy, 'validateHeight');
      jest.spyOn(ImagePolicy, 'validateSize');
      ImagePolicy.validate(props);
      expect(ImagePolicy.validateType).toHaveBeenCalledWith(props.type);
      expect(ImagePolicy.validateWidth).toHaveBeenCalledWith(props.width);
      expect(ImagePolicy.validateHeight).toHaveBeenCalledWith(props.height);
      expect(ImagePolicy.validateSize).toHaveBeenCalledWith(props.size, undefined);
    });

    it('should call validateSize with maxSize when provided', () => {
      const props = { id: UUID.generate(), type: ImageType.Webp, width: 100, height: 100, size: 100 };
      const maxSize = 512000; // 500KB
      jest.spyOn(ImagePolicy, 'validateType');
      jest.spyOn(ImagePolicy, 'validateWidth');
      jest.spyOn(ImagePolicy, 'validateHeight');
      jest.spyOn(ImagePolicy, 'validateSize');
      ImagePolicy.validate(props, maxSize);
      expect(ImagePolicy.validateType).toHaveBeenCalledWith(props.type);
      expect(ImagePolicy.validateWidth).toHaveBeenCalledWith(props.width);
      expect(ImagePolicy.validateHeight).toHaveBeenCalledWith(props.height);
      expect(ImagePolicy.validateSize).toHaveBeenCalledWith(props.size, maxSize);
    });
  });
});

import { ImageEntityType, ImageType } from '.';
import { Policy } from '../../base';

export class ImagePolicy extends Policy {
  public static validateType(type: ImageType): void {
    if (!type) {
      Policy.error({ key: 'ImageTypeRequired' });
    }

    if (!Object.values(ImageType).includes(type)) {
      Policy.error({ key: 'InvalidImageType', params: { type } });
    }
  }

  public static validateWidth(value: unknown): void {
    if (!value) {
      Policy.error({ key: 'WidthRequired' });
    }

    if (!Policy.isNumber(value)) {
      Policy.error({ key: 'InvalidWidth' });
    }
  }

  public static validateHeight(value: unknown): void {
    if (!value) {
      Policy.error({ key: 'HeightRequired' });
    }

    if (!Policy.isNumber(value)) {
      Policy.error({ key: 'InvalidHeight' });
    }
  }

  public static validateSize(value: unknown, maxSize?: number): void {
    if (!value) {
      Policy.error({ key: 'SizeRequired' });
    }

    if (!Policy.isNumber(value)) {
      Policy.error({ key: 'InvalidSize' });
    }

    if (maxSize && maxSize < Number(value)) {
      Policy.error({ key: 'MaxFileSize', params: { value: maxSize / 1024 } });
    }
  }

  public static validate(props: ImageEntityType, maxSize?: number): void {
    ImagePolicy.validateType(props.type);
    ImagePolicy.validateWidth(props.width);
    ImagePolicy.validateHeight(props.height);
    ImagePolicy.validateSize(props.size, maxSize);
  }
}

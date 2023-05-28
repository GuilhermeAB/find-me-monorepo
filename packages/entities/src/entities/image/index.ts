import { BaseEntityProps } from '../../base';
import { ImageProps } from './image.entity';

export {
  ImageEntity, ImageProps, ImageType, CreateImageProps,
} from './image.entity';

export interface ImageEntityType extends ImageProps, BaseEntityProps {}

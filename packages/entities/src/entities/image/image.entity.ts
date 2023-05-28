import { UUID } from '@find-me/uuid';
import { Entity } from '../../base';
import { ImagePolicy } from './image.policy';

export enum ImageType {
  Webp = 'webp',
}

export type ImageProps<T = unknown> = {
  type: ImageType,
  width: number,
  height: number,
  size: number,
} & T;

export type CreateImageProps<T = unknown> = Omit<ImageProps, 'type'> & {
  type: string | ImageType,
} & T;

export class ImageEntity<T> extends Entity<ImageProps<T>> {
  public static new(create: CreateImageProps, id?: UUID): ImageEntity<unknown> {
    const image = new ImageEntity({
      id,
      props: {
        ...create,
        type: create.type as ImageType,
      },
      timestamps: true,
    });

    return image;
  }

  /**
   * Validate image entity
   *
   * @param maxSize MaxSize in KB
   */
  public validate(maxSize?: number): void {
    ImagePolicy.validate(this.getProps(), maxSize);
  }
}

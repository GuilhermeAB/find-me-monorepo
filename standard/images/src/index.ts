import sharp, { Metadata, ResizeOptions, WebpOptions } from 'sharp';

export class ImageHandler {
  private buffer: Buffer;

  constructor(value: Buffer) {
    this.buffer = value;
  }

  public image(): Buffer {
    return this.buffer;
  }

  public async metadata(): Promise<Metadata> {
    const metadata = await sharp(this.buffer).metadata();

    const size = metadata.size! / 1024;

    return {
      ...metadata,
      size,
    };
  }

  public async toWebp(options?: WebpOptions): Promise<ImageHandler> {
    this.buffer = await sharp(this.buffer)
      .webp(options)
      .toBuffer();

    return this;
  }

  public async resize(options: ResizeOptions): Promise<ImageHandler> {
    this.buffer = await sharp(this.buffer)
      .resize(options)
      .toBuffer();

    return this;
  }
}

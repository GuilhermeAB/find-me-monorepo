import { ImageHandler } from '..';
import sharp from 'sharp';

describe('ImageHandler', () => {
  it('should return the original image buffer', async () => {
    const image = sharp({
      create: {
        width: 100,
        height: 100,
        channels: 3,
        background: { r: 255, g: 0, b: 0 }
      }
    });
    const imageBuffer = await image.toBuffer();
    const imageHandler = new ImageHandler(imageBuffer);

    const result = imageHandler.image();
    expect(result).toEqual(imageBuffer);
  });

  describe('metadata', () => {
    it('should return the metadata of the image', async () => {
      const image = sharp({
        create: {
          width: 100,
          height: 100,
          channels: 3,
          background: { r: 255, g: 0, b: 0 }
        },
      }).jpeg();

      const imageBuffer = await image.toBuffer();
      const imageHandler = new ImageHandler(imageBuffer);

      const result = await imageHandler.metadata();

      // Check that all properties of the metadata are present
      expect(result.width).toBe(100);
      expect(result.height).toBe(100);
      expect(result.format).toBe('jpeg');

      // Check that the size is calculated correctly (in KB)
      const expectedSize = imageBuffer.length / 1024;
      expect(result.size).toBe(expectedSize);
    });
  });

  describe('toWebp', () => {
    it('should convert the image to WebP format', async () => {
      const image = sharp({
        create: {
          width: 100,
          height: 100,
          channels: 3,
          background: { r: 255, g: 0, b: 0 }
        }
      }).jpeg();
      const imageBuffer = await image.toBuffer();
      const imageHandler = new ImageHandler(imageBuffer);

      const result = await imageHandler.toWebp();

      // Check that the image is now in WebP format
      expect(result.image().toString('hex', 0, 4)).toBe('52494646'); // 'RIFF' in hex
      expect(result.image().toString('hex', 8, 12)).toBe('57454250'); // 'WEBP' in hex
    });

    it('should apply the WebP options provided as argument', async () => {
      const image = sharp({
        create: {
          width: 100,
          height: 100,
          channels: 3,
          background: { r: 255, g: 0, b: 0 }
        }
      }).jpeg();
      const imageBuffer = await image.toBuffer();
      const imageHandler = new ImageHandler(imageBuffer);

      const options = { quality: 50 };
      const result = await imageHandler.toWebp(options);

      // Check that the image is still valid and has the expected size
      expect(result.image().length).toBeGreaterThan(0);
      expect(result.image().length).toBeLessThan(imageBuffer.length);

      // Check that the options were applied correctly
      const metadata = await sharp(result.image()).metadata();
      expect(metadata.format).toBe('webp');
    });
  });

  describe('resize', () => {
    it('should resize the image to the specified dimensions', async () => {
      const image = sharp({
        create: {
          width: 100,
          height: 100,
          channels: 3,
          background: { r: 255, g: 0, b: 0 }
        }
      }).jpeg();
      const imageBuffer = await image.toBuffer();
      const imageHandler = new ImageHandler(imageBuffer);

      const options = { width: 50, height: 50 };
      const result = await imageHandler.resize(options);

      // Check that the image is now smaller
      expect(result.image().length).toBeLessThan(imageBuffer.length);

      // Check that the dimensions are correct
      const metadata = await sharp(result.image()).metadata();
      expect(metadata.width).toBe(options.width);
      expect(metadata.height).toBe(options.height);
    });
  });
});
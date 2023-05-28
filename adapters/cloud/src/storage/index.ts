import {
  GetObjectCommand,
  GetObjectCommandOutput,
  HeadObjectCommand,
  HeadObjectCommandOutput,
  PutObjectCommand,
  S3Client,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { ValidationError } from '@find-me/errors';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export type UploadValue = unknown | Record<string, unknown> | Buffer;

export class Storage {
  private client: S3Client;

  constructor() {
    const {
      AWS_REGION,
      AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY,
    } = process.env;

    if (!AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
      throw new ValidationError({ key: 'InvalidEnv' });
    }

    this.client = new S3Client({
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
      region: AWS_REGION,
    });
  }

  public async upload(bucket: string, key: string, value: UploadValue, acl = 'private'): Promise<void> {
    const body = value instanceof Buffer ? value : Buffer.from(JSON.stringify(value));

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ACL: acl,
    });

    await this.client.send(command);
  }

  public async get(bucket: string, key: string): Promise<GetObjectCommandOutput> {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    return this.client.send(command);
  }

  public async delete(bucket: string, key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    await this.client.send(command);
  }

  public async head(bucket: string, key: string): Promise<HeadObjectCommandOutput> {
    const command = new HeadObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    return this.client.send(command);
  }

  // 3600s = 1h
  public async getUrl(bucket: string, key: string, expiresIn = 3600): Promise<string> {
    try {
      const hasImage = await this.head(bucket, key);
      if (!hasImage) {
        throw new ValidationError({ key: 'ImageNotFound' });
      }

      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      });

      const url = await getSignedUrl(this.client, command, { expiresIn });
      return url;
    } catch (error) {
      throw new ValidationError({ key: 'ImageNotFound' });
    }
  }
}

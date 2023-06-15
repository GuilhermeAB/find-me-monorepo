import { ValidationError } from '@find-me/errors';
import { createClient } from 'redis';
import type { RedisClientType } from 'redis';

export class CacheService {
  private client: RedisClientType;

  constructor() {
    const {
      REDIS_URL,
      REDIS_USERNAME,
      REDIS_PASSWORD,
    } = process.env;

    if (!REDIS_URL || !REDIS_USERNAME || !REDIS_PASSWORD) {
      throw new ValidationError({ key: 'InvalidEnv' });
    }

    this.client = createClient({
      url: REDIS_URL,
      username: REDIS_USERNAME,
      password: REDIS_PASSWORD,
    });
  }

  public async add(key: string, revocationDate: Date): Promise<void> {
    await this.client.connect();

    await this.client.set(key, revocationDate.toString(), {
      PX: (new Date(revocationDate)).getTime(),
    });

    await this.client.disconnect();
  }

  public async exists(key: string): Promise<boolean> {
    await this.client.connect();
    const result = await this.client.get(key);
    await this.client.disconnect();

    return !!result;
  }

  public async get(key: string): Promise<string | null> {
    await this.client.connect();
    const result = await this.client.get(key);
    await this.client.disconnect();

    return result;
  }
}

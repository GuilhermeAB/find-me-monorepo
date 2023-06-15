import { Session } from '@find-me/database';
import { AlertImageRepository } from '@find-me/repositories';
import { Storage } from '@find-me/cloud';
import { CacheService } from '@find-me/cache';

export class AlertImageService {
  protected repository: AlertImageRepository;

  protected storage: Storage;

  protected cache: CacheService;

  constructor(session?: Session) {
    this.repository = new AlertImageRepository(session);
    this.storage = new Storage();
    this.cache = new CacheService();
  }
}

import { Session } from '@find-me/database';
import { AlertImageRepository } from '@find-me/repositories';
import { Storage } from '@find-me/cloud';

export class AlertImageService {
  protected repository: AlertImageRepository;

  protected storage: Storage;

  constructor(session?: Session) {
    this.repository = new AlertImageRepository(session);
    this.storage = new Storage();
  }
}

import { Session } from '@find-me/database';
import { AlertImageRepository, AlertRepository } from '@find-me/repositories';
import { Storage } from '@find-me/cloud';

export class AlertService {
  protected repository: AlertRepository;

  protected repositoryImage: AlertImageRepository;

  protected storage: Storage;

  constructor(session?: Session) {
    this.repository = new AlertRepository(session);
    this.repositoryImage = new AlertImageRepository(session);
    this.storage = new Storage();
  }
}

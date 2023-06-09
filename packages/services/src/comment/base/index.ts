import { Session } from '@find-me/database';
import { AlertRepository, CommentRepository } from '@find-me/repositories/repositories';

export class CommentService {
  protected repository: CommentRepository;

  protected alertRepository: AlertRepository;

  constructor(session?: Session) {
    this.repository = new CommentRepository(session);
    this.alertRepository = new AlertRepository(session);
  }
}

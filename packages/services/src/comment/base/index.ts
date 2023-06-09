import { Session } from '@find-me/database';
import { CommentRepository } from '@find-me/repositories/repositories';

export class CommentService {
  protected repository: CommentRepository;

  constructor(session?: Session) {
    this.repository = new CommentRepository(session);
  }
}

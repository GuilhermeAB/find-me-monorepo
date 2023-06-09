import { CommentService } from '../base';

export class CommentListService extends CommentService {
  public async list(alertId: string): Promise<unknown[] | undefined> {
    const list = await this.repository.list(alertId);

    if (list) {
      return list.map((item) => item.getFlatProps(['password', 'status']));
    }

    return undefined;
  }
}

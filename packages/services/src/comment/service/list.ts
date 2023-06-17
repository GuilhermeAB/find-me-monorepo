import { CommentService } from '../base';

export class CommentListService extends CommentService {
  public async list(alertId: string): Promise<{ list: unknown[], count: { comments: number, replies: number } } | undefined> {
    const result = await this.repository.list(alertId);

    if (result) {
      const list = result.list.map((item) => item.getFlatProps(['password', 'status']));

      return { list, count: result.count };
    }

    return undefined;
  }
}

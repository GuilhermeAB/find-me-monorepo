import {
  CommentEntity, CommentReplyEntity, CreateCommentProps, CreateCommentReplyProps,
} from '@find-me/entities';
import { CommentService } from '../base';

export class CommentCreateService extends CommentService {
  public async create(props: CreateCommentProps): Promise<CommentEntity> {
    const entity = CommentEntity.create(props);
    await this.repository.create(entity);

    const comment = await this.repository.findCommentById(entity.getProps().id.value);
    return comment!;
  }

  public async createReply(commentId: string, props: CreateCommentReplyProps): Promise<CommentReplyEntity> {
    const entity = CommentReplyEntity.create(props);
    await this.repository.addReply(commentId, entity);

    const reply = await this.repository.findOneReply(commentId, entity.getProps().id.value);
    return reply!;
  }
}

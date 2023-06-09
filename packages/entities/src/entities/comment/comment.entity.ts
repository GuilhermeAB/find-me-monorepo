import { UUID } from '@find-me/uuid';
import { AccountEntity } from '../account';
import { Entity } from '../../base';
import { CommentPolicy } from './comment.policy';
import { CommentReplyEntity } from '../comment-reply';

export interface CommentProps {
  content: string,
  alert: UUID,
  account: UUID | AccountEntity,
  replies: CommentReplyEntity[],
}

export type CreateCommentProps = Omit<CommentProps, 'alert' | 'account' | 'replies'> & {
  account: string | UUID | AccountEntity,
  alert: string | UUID,
  replies?: CommentReplyEntity[],
};

export class CommentEntity extends Entity<CommentProps> {
  public static create(create: CreateCommentProps): CommentEntity {
    const comment = new CommentEntity({
      props: {
        content: create.content.trim(),
        alert: UUID.generate(create.alert),
        account: typeof create.account === 'string' || create.account instanceof UUID ? UUID.generate(create.account) : create.account,
        replies: create.replies || [],
      },
      timestamps: true,
    });

    comment.validate();

    return comment;
  }

  public validate(): void {
    CommentPolicy.validate(this.getProps());
  }
}

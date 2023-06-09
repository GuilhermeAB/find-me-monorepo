import { UUID } from '@find-me/uuid';
import { AccountEntity } from '../account';
import { Entity } from '../../base';
import { CommentReplyPolicy } from './comment-reply.policy';

export interface CommentReplyProps {
  content: string,
  account: UUID | AccountEntity,
}

export type CreateCommentReplyProps = Omit<CommentReplyProps, 'account'> & {
  account: string | UUID | AccountEntity,
};

export class CommentReplyEntity extends Entity<CommentReplyProps> {
  public static create(create: CreateCommentReplyProps): CommentReplyEntity {
    const reply = new CommentReplyEntity({
      props: {
        content: create.content.trim(),
        account: typeof create.account === 'string' || create.account instanceof UUID ? UUID.generate(create.account) : create.account,
      },
      timestamps: true,
    });

    reply.validate();

    return reply;
  }

  public validate(): void {
    CommentReplyPolicy.validate(this.getProps());
  }
}

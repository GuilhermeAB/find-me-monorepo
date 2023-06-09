import { DTO } from '@find-me/database';
import {
  AccountEntityType, CommentEntityType, CommentReplyEntityType, PersonEntityType,
} from '@find-me/entities';
import { DTOAlert } from './alert';
import { DTOAccount } from './account';

export type DTOCommentType = Omit<CommentEntityType, 'id' | 'account' | 'replies'> & {
  _id: string,
  account: Omit<AccountEntityType, 'id' | 'person'> & {
    _id: string,
    person: Omit<PersonEntityType, 'id'> & { _id: string }
  },
  replies: Array<Omit<CommentReplyEntityType, 'id' | 'account'> & {
    _id: string,
    account: Omit<AccountEntityType, 'id' | 'person'> & {
      _id: string,
      person: Omit<PersonEntityType, 'id'> & { _id: string }
    },
  }>
};

class Comment extends DTO<DTOCommentType> {
  public static create(): Comment {
    const schema = new Comment({
      name: 'Comment',
      schema: {
        _id: String,
        content: String,
        alert: { type: String, ref: DTOAlert.name },
        account: { type: String, ref: DTOAccount.name },
        replies: [{
          _id: String,
          content: String,
          account: { type: String, ref: DTOAccount.name },
          createdAt: Date,
          updatedAt: Date,
        }],
      },
      options: {
        timestamps: true,
      },
    });

    return schema;
  }
}

export const DTOComment = Comment.create();

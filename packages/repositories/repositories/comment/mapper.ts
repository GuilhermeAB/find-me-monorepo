import {
  AccountEntity, CommentEntity, CommentProps, CommentReplyEntity,
} from '@find-me/entities';
import { EntityProps, Mapper } from '@find-me/repositories/base/mapper';
import { DTOCommentType } from '@find-me/repositories/schema/comment';
import { UUID } from '@find-me/uuid';
import { AccountMapper } from '../account/mapper';

export class CommentMapper extends Mapper<CommentEntity, DTOCommentType> {
  protected toDomainProps(entity: DTOCommentType): EntityProps<CommentProps> {
    const accountMapper = new AccountMapper(AccountEntity);

    const {
      _id: id,
      createdAt,
      updatedAt,
      account,
      replies,
      ...props
    } = entity;

    return {
      id,
      createdAt,
      updatedAt,
      props: {
        ...props,
        account: account instanceof UUID || typeof account === 'string' ? account : accountMapper.toEntity(account),
        replies: replies ? replies.map((reply) => new CommentReplyEntity({
          id: reply._id,
          props: {
            content: reply.content,
            account: reply.account instanceof UUID || typeof reply.account === 'string' ? reply.account : accountMapper.toEntity(reply.account),
          },
          createdAt: reply.createdAt,
          updatedAt: reply.updatedAt,
        })) : [],
      },
    };
  }
}

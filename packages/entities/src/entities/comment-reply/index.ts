import { BaseEntityProps } from '../../base';
import { CommentReplyProps } from './comment-reply.entity';

export * from './comment-reply.entity';

export interface CommentReplyEntityType extends CommentReplyProps, BaseEntityProps {}

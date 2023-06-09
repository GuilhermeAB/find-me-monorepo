import { BaseEntityProps } from '../../base';
import { CommentProps } from './comment.entity';

export * from './comment.entity';

export interface CommentEntityType extends CommentProps, BaseEntityProps {}

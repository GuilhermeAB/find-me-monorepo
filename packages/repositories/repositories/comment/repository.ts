import {
  AccountEntity,
  CommentEntity,
  CommentReplyEntity,
  PersonEntity,
} from '@find-me/entities';
import { Repository } from '@find-me/repositories/base/repository';
import { DTOComment, DTOCommentType } from '@find-me/repositories/schema/comment';
import { UUID } from '@find-me/uuid';
import { CommentMapper } from './mapper';

export class CommentRepository extends Repository<DTOCommentType, CommentEntity> {
  protected Model = DTOComment.model;

  protected mapper = new CommentMapper(CommentEntity);

  public async list(alertId: string): Promise<{ list: CommentEntity[], count: { comments: number, replies: number } } | undefined> {
    const result = await this.Model.find(
      {
        alert: alertId,
      },
      undefined,
      {
        session: this.session,
        lean: true,
      },
    )
      .populate({
        path: 'account',
        populate: [
          { path: 'person' },
        ],
      })
      .populate({
        path: 'replies.account',
        populate: [
          { path: 'person' },
        ],
      })
      .exec();

    if (result && result.length) {
      const list = this.mapper.toEntities(result);
      const countResult = await this.Model.aggregate<{ comments: number, replies: number }>([
        {
          $match: { alert: { $eq: alertId } },
        },
        {
          $project: {
            comments: { $sum: 1 },
            replies: { $size: '$replies' },
          },
        },
      ]).exec();

      const count = {
        comments: countResult.map((r) => r.comments).reduce((value, currentValue) => (value + currentValue)),
        replies: countResult.map((r) => r.replies).reduce((value, currentValue) => (value + currentValue)),
      };

      return { list, count };
    }

    return undefined;
  }

  public async exists(id: string): Promise<boolean> {
    const result = await this.Model.exists(
      {
        _id: id,
      },
    ).exec();

    return !!result;
  }

  public async findCommentById(id: string): Promise<CommentEntity | undefined> {
    const result = await this.Model.findOne(
      {
        _id: id,
      },
      undefined,
      {
        session: this.session,
        lean: true,
      },
    )
      .populate({
        path: 'account',
        populate: [
          { path: 'person' },
        ],
      })
      .populate({
        path: 'replies.account',
        populate: [
          { path: 'person' },
        ],
      })
      .exec();

    return result ? this.mapper.toEntity(result) : undefined;
  }

  public async updateOne(entity: CommentEntity): Promise<void> {
    const {
      id,
      content,
    } = entity.getProps();

    await this.Model.updateOne(
      {
        _id: id.value,
      },
      {
        $set: {
          content,
        },
      },
      {
        session: this.session,
      },
    ).exec();
  }

  public async findOneReply(commentId: string, replyId: string): Promise<CommentReplyEntity | undefined> {
    const result = await this.Model.findOne(
      {
        _id: commentId,
      },
      {
        replies: {
          $elemMatch: {
            _id: replyId,
          },
        },
      },
      {
        session: this.session,
        lean: true,
      },
    )
      .populate({
        path: 'replies.account',
        populate: [
          { path: 'person' },
        ],
      })
      .exec();

    if (result && result.replies?.length && result.replies[0]) {
      const item = result.replies[0];

      const entity = new CommentReplyEntity({
        id: item._id,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        props: {
          content: item.content,
          account: typeof item.account === 'string' ? UUID.generate(item.account) : new AccountEntity({
            id: item.account._id,
            props: {
              email: item.account.email,
              password: item.account.password,
              role: item.account.role,
              status: item.account.status,
              person: typeof item.account.person === 'string' ? UUID.generate(item.account.person) : new PersonEntity({
                id: item.account.person._id,
                props: {
                  birthDate: item.account.person.birthDate,
                  name: item.account.person.name,
                },
              }),
            },
          }),
        },
      });

      return entity;
    }
    return undefined;
  }

  public async addReply(commentId: string, entity: CommentReplyEntity): Promise<void> {
    const {
      id,
      content,
      account,
      createdAt,
      updatedAt,
    } = entity.getProps();

    await this.Model.updateOne(
      {
        _id: commentId,
      },
      {
        $push: {
          replies: {
            _id: id.value,
            content,
            account: account instanceof UUID ? account.value : account.getProps().id.value,
            createdAt: createdAt?.value,
            updatedAt: updatedAt?.value,
          },
        },
      },
      {
        session: this.session,
      },
    ).exec();
  }

  public async updateReply(commentId: string, entity: CommentReplyEntity): Promise<void> {
    const {
      id,
      content,
    } = entity.getProps();

    await this.Model.updateOne(
      {
        _id: commentId,
        'replies._id': id.value,
      },
      {
        $set: {
          'replies.$.content': content,
          'replies.$.updatedAt': new Date(),
        },
      },
      {
        session: this.session,
      },
    ).exec();
  }
}

import { UUID } from '@find-me/uuid';
import { CommentReplyEntity, CreateCommentReplyProps } from '../comment-reply.entity';

describe('CommentReplyEntity', () => {
  describe('create', () => {
    it('should create a new comment reply entity', () => {
      const create: CreateCommentReplyProps = {
        content: 'valid content',
        account: UUID.generate(),
      };
      const comment = CommentReplyEntity.create(create);

      expect(comment).toBeInstanceOf(CommentReplyEntity);
      expect(comment.getProps()).toEqual({
        id: expect.anything(),
        content: create.content.trim(),
        account: create.account,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
      expect(comment.getProps()).toHaveProperty('createdAt');
      expect(comment.getProps()).toHaveProperty('updatedAt');
    });

    it('should generate UUID for account and alert if provided as string', () => {
      const accountString = UUID.generate();
      const alertString = UUID.generate();

      const create: CreateCommentReplyProps = {
        content: 'content'.repeat(5),
        account: accountString.value,
      };
      const comment = CommentReplyEntity.create(create);

      expect(comment.getProps().account).toEqual(UUID.generate(accountString));
    });

    it('should trim content before creating comment entity', () => {
      const create: CreateCommentReplyProps = {
        content: '     valid content    ',
        account: UUID.generate(),
      };
      const comment = CommentReplyEntity.create(create);

      expect(comment.getProps().content).toEqual('valid content');
    });
  });

  describe('validate', () => {
    it('should call validate of CommentReplyPolicy with props', () => {
      const validateSpy = jest.spyOn(CommentReplyEntity.prototype, 'validate');
      
      const comment = new CommentReplyEntity({
        props: {
          content: 'valid content'.repeat(2),
          account: UUID.generate(),
        }
      });
      comment.validate();

      expect(validateSpy).toHaveBeenCalledTimes(1);

      validateSpy.mockRestore();
    });
  });
});

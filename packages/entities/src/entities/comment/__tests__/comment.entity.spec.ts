import { UUID } from '@find-me/uuid';
import { CommentEntity, CommentProps, CreateCommentProps } from '../comment.entity';
import { CommentPolicy } from '../comment.policy';

describe('CommentEntity', () => {
  describe('create', () => {
    it('should create a new comment entity', () => {
      const create: CreateCommentProps = {
        content: 'valid content',
        alert: UUID.generate(),
        account: UUID.generate(),
        replies: [],
      };
      const comment = CommentEntity.create(create);

      expect(comment).toBeInstanceOf(CommentEntity);
      expect(comment.getProps()).toEqual({
        id: expect.anything(),
        content: create.content.trim(),
        alert: create.alert,
        account: create.account,
        replies: create.replies || [],
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
      expect(comment.getProps()).toHaveProperty('createdAt');
      expect(comment.getProps()).toHaveProperty('updatedAt');
    });

    it('should generate UUID for account and alert if provided as string', () => {
      const accountString = UUID.generate();
      const alertString = UUID.generate();

      const create: CreateCommentProps = {
        content: 'content'.repeat(5),
        account: accountString.value,
        alert: alertString.value,
      };
      const comment = CommentEntity.create(create);

      expect(comment.getProps().account).toEqual(UUID.generate(accountString));
      expect(comment.getProps().alert).toEqual(UUID.generate(alertString));
    });

    it('should trim content before creating comment entity', () => {
      const create: CreateCommentProps = {
        content: '     valid content    ',
        alert: UUID.generate(),
        account: UUID.generate(),
        replies: [],
      };
      const comment = CommentEntity.create(create);

      expect(comment.getProps().content).toEqual('valid content');
    });
  });

  describe('validate', () => {
    it('should call validate of CommentPolicy with props', () => {
      const validateSpy = jest.spyOn(CommentEntity.prototype, 'validate');
      
      const comment = new CommentEntity({
        props: {
          content: 'valid content'.repeat(2),
          alert: UUID.generate(),
          account: UUID.generate(),
          replies: [],
        }
      });
      comment.validate();

      expect(validateSpy).toHaveBeenCalledTimes(1);

      validateSpy.mockRestore();
    });
  });
});

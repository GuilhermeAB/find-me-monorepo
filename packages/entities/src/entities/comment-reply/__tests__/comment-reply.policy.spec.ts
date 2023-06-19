import { ValidationError } from '@find-me/errors';
import { CommentReplyPolicy } from '../comment-reply.policy';
import { UUID } from '@find-me/uuid';

const CONTENT_MAX_LENGTH = 200;

describe('CommentReplyPolicy', () => {
  describe('validateContent', () => {
    it('should not throw an error when given valid content', () => {
      expect(() => CommentReplyPolicy.validateContent('valid content')).not.toThrow();
    });

    it('should throw an error when given empty content', () => {
      expect(() => CommentReplyPolicy.validateContent('')).toThrowError(ValidationError);
    });

    it('should throw an error when given content with length less than the minimum', () => {
      expect(() => CommentReplyPolicy.validateContent('short')).toThrowError(ValidationError);
    });

    it('should throw an error when given content with length greater than the maximum', () => {
      const longContent = 'a'.repeat(CONTENT_MAX_LENGTH + 1);
      expect(() => CommentReplyPolicy.validateContent(longContent)).toThrowError(ValidationError);
    });
  });

  describe('validate', () => {
    it('should call validateContent with the correct props', () => {
      const props = {
        content: 'valid content',
        account: UUID.generate(),
      };
      jest.spyOn(CommentReplyPolicy, 'validateContent');
      CommentReplyPolicy.validate(props);
      expect(CommentReplyPolicy.validateContent).toHaveBeenCalledWith(props.content);
    });
  });
});

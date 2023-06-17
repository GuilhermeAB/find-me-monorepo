import { ValidationError } from '@find-me/errors';
import { CommentPolicy } from '../comment.policy';
import { CommentProps } from '..';
import { UUID } from '@find-me/uuid';

describe('CommentPolicy', () => {
  describe('validateContent', () => {
    it('should throw error if content is empty', () => {
      expect(() => CommentPolicy.validateContent('')).toThrow(ValidationError);
      expect(() => CommentPolicy.validateContent(null)).toThrow(ValidationError);
      expect(() => CommentPolicy.validateContent(undefined)).toThrow(ValidationError);
    });

    it('should throw error if content is less than 10 characters', () => {
      const value = 'a'.repeat(9);
      expect(() => CommentPolicy.validateContent(value)).toThrow(ValidationError);
    });

    it('should throw error if content is more than 200 characters', () => {
      const value = 'a'.repeat(201);
      expect(() => CommentPolicy.validateContent(value)).toThrow(ValidationError);
    });
    
    it('should not throw any error if content is valid', () => {
      const value = 'a'.repeat(50);
      expect(() => CommentPolicy.validateContent(value)).not.toThrow();
    });
  });

  describe('validate', () => {
    it('should validate props', () => {
      const props: CommentProps = {
        content: 'valid content',
        replies: [],
        account: UUID.generate(),
        alert: UUID.generate(),
      };
      expect(() => CommentPolicy.validate(props)).not.toThrow();
    });
    
    it('should call validateContent with correct prop', () => {
      const validateContentSpy = jest.spyOn(CommentPolicy, 'validateContent');
      const props = {
        content: 'valid content',
        replies: [],
        account: UUID.generate(),
        alert: UUID.generate(),
      };
      CommentPolicy.validate(props);
      expect(validateContentSpy).toHaveBeenCalledWith(props.content);
      validateContentSpy.mockRestore();
    });
  });
});

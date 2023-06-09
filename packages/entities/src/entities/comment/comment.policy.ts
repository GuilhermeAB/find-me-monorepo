import { Policy } from '../../base';
import { CommentProps } from '.';

const CONTENT_MIN_LENGTH = 10;
const CONTENT_MAX_LENGTH = 200;

export class CommentPolicy extends Policy {
  public static validateContent(value: string): void {
    if (!value) {
      Policy.error({ key: 'ContentRequired' });
    }

    if (!Policy.lengthIsBetween(value, CONTENT_MIN_LENGTH, CONTENT_MAX_LENGTH)) {
      Policy.error({ key: 'ContentLength', params: { min: CONTENT_MIN_LENGTH, max: CONTENT_MAX_LENGTH } });
    }
  }

  public static validate(props: CommentProps): void {
    CommentPolicy.validateContent(props.content);
  }
}

import {
  MethodParams, MethodResponse, MethodType, RouteJsonController, Session,
} from '@find-me/api';
import { Status } from '@find-me/errors';
import { Authentication, CommentCreateService } from '@find-me/services';

class CommentReplyCreateController {
  private async method({
    data, params, cookies, headers,
  }: MethodParams, session?: Session): Promise<MethodResponse> {
    const user = Authentication.authenticate({ ...cookies, ...headers });
    const service = new CommentCreateService(session);

    const {
      id,
    } = params;

    const {
      content,
    } = data;

    const value = await service.createReply(id, {
      account: user.accountId,
      content,
    });

    return {
      status: Status.Success,
      message: 'CommentReplyCreated',
      value: value.getFlatProps(['password', 'status']),
    };
  }

  public create(): RouteJsonController {
    return new RouteJsonController({
      path: '/comment/create-reply/:id',
      methodType: MethodType.Post,
      method: this.method.bind(this),
    });
  }
}

const commentCreateReply = new CommentReplyCreateController();

export {
  commentCreateReply,
};

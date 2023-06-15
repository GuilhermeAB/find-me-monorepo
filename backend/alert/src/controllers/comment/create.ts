import {
  MethodParams, MethodResponse, MethodType, RouteJsonController, Session,
} from '@find-me/api';
import { Status } from '@find-me/errors';
import { Authentication, CommentCreateService } from '@find-me/services';

class CommentCreateController {
  private async method({
    data, params, cookies, headers,
  }: MethodParams, session?: Session): Promise<MethodResponse> {
    const user = await Authentication.authenticate({ ...cookies, ...headers });
    const service = new CommentCreateService(session);

    const {
      id,
    } = params;

    const {
      content,
    } = data;

    const value = await service.create({
      account: user.accountId,
      alert: id,
      content,
    });

    return {
      status: Status.Success,
      message: 'CommentCreated',
      value: value.getFlatProps(['password', 'status']),
    };
  }

  public create(): RouteJsonController {
    return new RouteJsonController({
      path: '/comment/create/:id',
      methodType: MethodType.Post,
      method: this.method.bind(this),
    });
  }
}

const commentCreate = new CommentCreateController();

export {
  commentCreate,
};

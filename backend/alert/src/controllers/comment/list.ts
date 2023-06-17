import {
  MethodParams, MethodResponse, MethodType, RouteJsonController,
} from '@find-me/api';
import { Status } from '@find-me/errors';
import { CommentListService } from '@find-me/services';

class CommentListController {
  private async method({
    params,
  }: MethodParams): Promise<MethodResponse> {
    const service = new CommentListService();

    const {
      id,
    } = params;

    const result = await service.list(id);

    return {
      status: Status.Success,
      value: result,
    };
  }

  public create(): RouteJsonController {
    return new RouteJsonController({
      path: '/comment/:id',
      methodType: MethodType.Get,
      method: this.method.bind(this),
    });
  }
}

const commentList = new CommentListController();

export {
  commentList,
};

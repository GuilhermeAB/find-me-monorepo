import {
  MethodParams,
  MethodResponse, MethodType, RouteJsonController,
} from '@find-me/api';
import { Status } from '@find-me/errors';
import { AlertListService, Authentication } from '@find-me/services';

class AlertListByUserController {
  private async method({ cookies, headers }: MethodParams): Promise<MethodResponse> {
    const user = Authentication.authenticate({ ...cookies, ...headers });
    const service = new AlertListService();

    const list = await service.listByUser(user.accountId);

    return {
      status: Status.Success,
      value: {
        list,
      },
    };
  }

  public create(): RouteJsonController {
    return new RouteJsonController({
      path: '/list-by-user',
      methodType: MethodType.Get,
      method: this.method.bind(this),
    });
  }
}

const alertListByUser = new AlertListByUserController();

export {
  alertListByUser,
};

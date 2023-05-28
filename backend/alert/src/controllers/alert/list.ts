import {
  MethodParams,
  MethodResponse, MethodType, RouteJsonController,
} from '@find-me/api';
import { Status } from '@find-me/errors';
import { AlertListService } from '@find-me/services';

class AlertListController {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async method(data: MethodParams): Promise<MethodResponse> {
    const service = new AlertListService();

    const list = await service.list();

    return {
      status: Status.Success,
      value: {
        list,
      },
    };
  }

  public create(): RouteJsonController {
    return new RouteJsonController({
      path: '/list',
      methodType: MethodType.Get,
      method: this.method.bind(this),
    });
  }
}

const alertList = new AlertListController();

export {
  alertList,
};

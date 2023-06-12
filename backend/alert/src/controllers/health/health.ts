import {
  MethodParams,
  MethodResponse,
  MethodType,
  RouteJsonController,
  Session,
} from '@find-me/api';
import { Status } from '@find-me/errors';

class HealthController {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async method(data: MethodParams, session?: Session): Promise<MethodResponse> {
    return {
      status: Status.Success,
      value: true,
    };
  }

  public create(): RouteJsonController {
    return new RouteJsonController({
      path: '/health',
      methodType: MethodType.Get,
      method: this.method.bind(this),
    });
  }
}

const health = new HealthController();

export {
  health,
};

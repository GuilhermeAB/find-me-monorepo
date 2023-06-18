import {
  Guard,
  MethodParams,
  MethodResponse,
  MethodType,
  RouteJsonController,
  Session,
} from '@find-me/api';
import { Status } from '@find-me/errors';
import { AccountActivationService, Authentication } from '@find-me/services';

class AccountActivationController {
  private static validation({ data }: MethodParams): void {
    Guard.required(data.code, { key: 'CodeRequired' });
  }

  private async method({ data, cookies, headers }: MethodParams, session?: Session): Promise<MethodResponse> {
    const user = await Authentication.authenticate({ ...cookies, ...headers });
    const service = new AccountActivationService(session);

    const {
      code,
    } = data;

    await service.activation(user.accountId, code);

    return {
      status: Status.Success,
      message: 'ActivationSuccess',
    };
  }

  public create(): RouteJsonController {
    return new RouteJsonController({
      path: '/verification',
      methodType: MethodType.Post,
      validation: AccountActivationController.validation.bind(this),
      method: this.method.bind(this),
    });
  }
}

const accountActivation = new AccountActivationController();

export {
  accountActivation,
};

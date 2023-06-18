import {
  MethodParams,
  MethodResponse,
  MethodType,
  RouteJsonController,
  Session,
} from '@find-me/api';
import { Status } from '@find-me/errors';
import { AccountActivationService, Authentication } from '@find-me/services';

class AccountActivationRequestController {
  private async method({ cookies, headers }: MethodParams, session?: Session): Promise<MethodResponse> {
    const user = await Authentication.authenticate({ ...cookies, ...headers });
    const service = new AccountActivationService(session);

    await service.requestNewCode(user.accountId);

    return {
      status: Status.Success,
      message: 'ActivationCodeSent',
    };
  }

  public create(): RouteJsonController {
    return new RouteJsonController({
      path: '/verification-request',
      methodType: MethodType.Post,
      method: this.method.bind(this),
    });
  }
}

const accountActivationRequest = new AccountActivationRequestController();

export {
  accountActivationRequest,
};

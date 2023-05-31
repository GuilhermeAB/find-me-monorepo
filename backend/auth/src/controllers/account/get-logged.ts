import {
  MethodParams,
  MethodResponse,
  MethodType,
  RouteJsonController,
  Session,
} from '@find-me/api';
import { Status } from '@find-me/errors';
import { AccountGetLoggedService, Authentication } from '@find-me/services';

class AccountLoggedUserController {
  private async method({ cookies, headers }: MethodParams, session?: Session): Promise<MethodResponse> {
    const user = Authentication.authenticate(cookies || headers);

    const service = new AccountGetLoggedService(session);

    const result = await service.getByAccount(user.accountId);

    return {
      status: Status.Success,
      value: result,
    };
  }

  public create(): RouteJsonController {
    return new RouteJsonController({
      path: '/logged-user',
      methodType: MethodType.Get,
      method: this.method.bind(this),
    });
  }
}

const accountLoggedUser = new AccountLoggedUserController();

export {
  accountLoggedUser,
};

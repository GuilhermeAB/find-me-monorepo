import {
  MethodParams,
  MethodResponse,
  MethodType,
  RouteJsonController,
} from '@find-me/api';
import { Status } from '@find-me/errors';
import { Authentication } from '@find-me/services';

class AccountSignOutController {
  private async method({ cookies, headers }: MethodParams): Promise<MethodResponse> {
    let token;

    try {
      token = await Authentication.authenticate({ ...cookies, ...headers });
      await Authentication.signOut(token);
    } catch (e) {
      return {
        status: Status.Success,
        value: undefined,
      };
    }

    return {
      status: Status.Success,
      message: 'SignOutSuccess',
      clearCookies: ['authentication'],
    };
  }

  public create(): RouteJsonController {
    return new RouteJsonController({
      path: '/sign-out',
      methodType: MethodType.Post,
      method: this.method.bind(this),
    });
  }
}

const accountSignOut = new AccountSignOutController();

export {
  accountSignOut,
};

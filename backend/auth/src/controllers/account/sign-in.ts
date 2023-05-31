import {
  Guard,
  MethodParams,
  MethodResponse,
  MethodType,
  RouteJsonController,
  Session,
} from '@find-me/api';
import { Status } from '@find-me/errors';
import { AccountSignInService } from '@find-me/services';

class AccountSignInController {
  private static validation({ data }: MethodParams): void {
    Guard.required(data.email, { key: 'EmailRequired' });
    Guard.required(data.password, { key: 'PasswordRequired' });
    Guard.isBoolean(data.rememberMe, { key: 'RememberMeInvalid' }, true);
  }

  private async method({ data }: MethodParams, session?: Session): Promise<MethodResponse> {
    const service = new AccountSignInService(session);

    const {
      email,
      password,
      rememberMe,
    } = data;

    const token = await service.signIn(email, password);

    return {
      status: Status.Success,
      message: 'SignInSuccess',
      token: rememberMe ? token : undefined,
      value: !rememberMe ? token : undefined,
    };
  }

  public create(): RouteJsonController {
    return new RouteJsonController({
      path: '/sign-in',
      methodType: MethodType.Post,
      validation: AccountSignInController.validation.bind(this),
      method: this.method.bind(this),
    });
  }
}

const accountSignIn = new AccountSignInController();

export {
  accountSignIn,
};

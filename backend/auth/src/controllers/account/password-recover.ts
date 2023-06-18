import {
  Guard,
  MethodParams,
  MethodResponse,
  MethodType,
  RouteJsonController,
  Session,
} from '@find-me/api';
import { Status } from '@find-me/errors';
import { AccountPasswordRecoverService } from '@find-me/services';

class AccountPasswordRecoverController {
  private static validation({ data }: MethodParams): void {
    Guard.required(data.email, { key: 'EmailRequired' });
    Guard.required(data.password, { key: 'PasswordRequired' });
    Guard.required(data.code, { key: 'CodeRequired' });
  }

  private async method({ data }: MethodParams, session?: Session): Promise<MethodResponse> {
    const service = new AccountPasswordRecoverService(session);

    const {
      code,
      email,
      password,
    } = data;

    await service.passwordRecover(email, code, password);

    return {
      status: Status.Success,
      message: 'PasswordChangeSuccess',
    };
  }

  public create(): RouteJsonController {
    return new RouteJsonController({
      path: '/password-recover',
      methodType: MethodType.Post,
      validation: AccountPasswordRecoverController.validation.bind(this),
      method: this.method.bind(this),
    });
  }
}

const accountPasswordRecover = new AccountPasswordRecoverController();

export {
  accountPasswordRecover,
};

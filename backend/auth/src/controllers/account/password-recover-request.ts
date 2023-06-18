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

class AccountPasswordRecoverRequestController {
  private static validation({ data }: MethodParams): void {
    Guard.required(data.email, { key: 'EmailRequired' });
  }

  private async method({ data }: MethodParams, session?: Session): Promise<MethodResponse> {
    const service = new AccountPasswordRecoverService(session);

    const {
      email,
    } = data;

    await service.requestNewCode(email);

    return {
      status: Status.Success,
      message: 'PasswordRecoverSent',
    };
  }

  public create(): RouteJsonController {
    return new RouteJsonController({
      path: '/password-recover-request',
      methodType: MethodType.Post,
      validation: AccountPasswordRecoverRequestController.validation.bind(this),
      method: this.method.bind(this),
    });
  }
}

const accountPasswordRecoverRequest = new AccountPasswordRecoverRequestController();

export {
  accountPasswordRecoverRequest,
};

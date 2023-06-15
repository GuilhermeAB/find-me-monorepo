import {
  Guard,
  MethodParams, MethodResponse, MethodType, RouteJsonController, Session,
} from '@find-me/api';
import { Status, ValidationError } from '@find-me/errors';
import { AccountUpdate, Authentication } from '@find-me/services';

class AccountUpdatePasswordController {
  private static validation({ data }: MethodParams): void {
    Guard.required(data.currentPassword, { key: 'PasswordRequired' });
    Guard.required(data.repeatPassword, { key: 'RepeatPasswordRequired' });
    Guard.required(data.password, { key: 'PasswordRequired' });

    if (data.repeatPassword !== data.password) {
      throw new ValidationError({ key: 'PasswordAndRepeatPasswordInvalid' });
    }
  }

  private async method({ data, cookies, headers }: MethodParams, session?: Session): Promise<MethodResponse> {
    const user = await Authentication.authenticate({ ...cookies, ...headers });
    const service = new AccountUpdate(session);

    const {
      currentPassword,
      password,
    } = data;

    await service.updatePassword(user.accountId, currentPassword, password);

    return {
      status: Status.Success,
      message: 'PasswordUpdated',
    };
  }

  public create(): RouteJsonController {
    return new RouteJsonController({
      path: '/update-password',
      methodType: MethodType.Patch,
      validation: AccountUpdatePasswordController.validation.bind(this),
      method: this.method.bind(this),
    });
  }
}

const accountUpdatePassword = new AccountUpdatePasswordController();

export {
  accountUpdatePassword,
};

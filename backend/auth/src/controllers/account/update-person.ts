import {
  Guard,
  MethodParams, MethodResponse, MethodType, RouteJsonController, Session,
} from '@find-me/api';
import { Status } from '@find-me/errors';
import { AccountUpdate, Authentication } from '@find-me/services';

class AccountUpdatePersonController {
  private static validation({ data }: MethodParams): void {
    Guard.required(data.name, { key: 'NameRequired' });
    Guard.required(data.birthDate, { key: 'BirthDateRequired' });
    Guard.isDate(data.birthDate);
  }

  private async method({ data, cookies, headers }: MethodParams, session?: Session): Promise<MethodResponse> {
    const user = await Authentication.authenticate({ ...cookies, ...headers });
    const service = new AccountUpdate(session);

    const {
      name,
      birthDate,
    } = data;

    await service.updatePerson(user.personId, name, birthDate);

    return {
      status: Status.Success,
      message: 'PersonUpdated',
    };
  }

  public create(): RouteJsonController {
    return new RouteJsonController({
      path: '/update-person',
      methodType: MethodType.Patch,
      validation: AccountUpdatePersonController.validation.bind(this),
      method: this.method.bind(this),
    });
  }
}

const accountUpdatePerson = new AccountUpdatePersonController();

export {
  accountUpdatePerson,
};

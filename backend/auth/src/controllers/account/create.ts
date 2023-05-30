import {
  Guard,
  MethodParams, MethodResponse, MethodType, RouteJsonController, Session,
} from '@find-me/api';
import { Status } from '@find-me/errors';
import { AccountCreateService } from '@find-me/services';
import { AccountRole, AccountStatus } from '@find-me/entities';

class AccountCreateController {
  private static validation({ data }: MethodParams): void {
    Guard.required(data.email, { key: 'EmailRequired' });
    Guard.required(data.password, { key: 'PasswordRequired' });
    Guard.required(data.name, { key: 'NameRequired' });
    Guard.required(data.birthDate, { key: 'BirthDateRequired' });
    Guard.isDate(data.birthDate);
  }

  private async method({ data }: MethodParams, session?: Session): Promise<MethodResponse> {
    const service = new AccountCreateService(session);

    const {
      email,
      password,
      name,
      birthDate,
    } = data;

    await service.create(
      {
        email,
        password,
        role: AccountRole.default,
        status: AccountStatus.unverified,
      },
      {
        name,
        birthDate,
      },
    );

    return {
      status: Status.Success,
      message: 'AccountCreated',
    };
  }

  public create(): RouteJsonController {
    return new RouteJsonController({
      path: '/create',
      methodType: MethodType.Post,
      validation: AccountCreateController.validation.bind(this),
      method: this.method.bind(this),
    });
  }
}

const accountCreate = new AccountCreateController();

export {
  accountCreate,
};

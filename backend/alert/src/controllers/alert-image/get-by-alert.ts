import {
  Guard,
  MethodParams,
  MethodResponse, MethodType, RouteRedirectController, Session,
} from '@find-me/api';
import { Status } from '@find-me/errors';
import { AlertImageGetService } from '@find-me/services';

class AlertImageGetController {
  private static validation({ params }: MethodParams): void {
    Guard.required(params.id, { key: 'IdRequired' });
    Guard.isUUID(params.id);
  }

  private async method({ params }: MethodParams, session?: Session): Promise<MethodResponse> {
    const service = new AlertImageGetService(session);

    const {
      id,
    } = params;
    const url = await service.getByAlert(id);

    return {
      status: Status.Success,
      value: url,
    };
  }

  public create(): RouteRedirectController {
    return new RouteRedirectController({
      path: '/image/:id',
      methodType: MethodType.Get,
      validation: AlertImageGetController.validation.bind(this),
      method: this.method.bind(this),
    });
  }
}

const alertImageGetByAlertId = new AlertImageGetController();

export {
  alertImageGetByAlertId,
};

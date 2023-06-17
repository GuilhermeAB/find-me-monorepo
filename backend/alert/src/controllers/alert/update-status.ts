import { AlertStatus } from '@find-me/entities';
import {
  Guard,
  MethodParams, MethodResponse, MethodType, RouteJsonController, Session,
} from '@find-me/api';
import { Status } from '@find-me/errors';
import { AlertUpdateService, Authentication } from '@find-me/services';

class AlertUpdateStatusController {
  private static validation({ data, params }: MethodParams): void {
    Guard.required(params.id, { key: 'IdRequired' });
    Guard.isUUID(params.id);
    Guard.required(data.status, { key: 'AlertStatusRequired' });
    Guard.isEnumValue(data.status, AlertStatus, { key: 'InvalidAlertStatus', params: { status: data.status } });
  }

  private async method({
    data, params, cookies, headers,
  }: MethodParams, session?: Session): Promise<MethodResponse> {
    const user = await Authentication.authenticate({ ...cookies, ...headers });
    const service = new AlertUpdateService(session);

    const {
      status,
    } = data;

    await service.updateStatus(
      params.id,
      user.accountId,
      status,
    );

    return {
      status: Status.Success,
      message: 'AlertUpdated',
    };
  }

  public create(): RouteJsonController {
    return new RouteJsonController({
      path: '/update/status/:id',
      methodType: MethodType.Patch,
      validation: AlertUpdateStatusController.validation.bind(this),
      method: this.method.bind(this),
    });
  }
}

const alertUpdateStatus = new AlertUpdateStatusController();

export {
  alertUpdateStatus,
};

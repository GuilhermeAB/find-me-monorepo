import {
  Guard,
  MethodParams,
  MethodResponse, MethodType, RouteJsonController,
} from '@find-me/api';
import { Status } from '@find-me/errors';
import { AlertListService } from '@find-me/services';

class AlertListController {
  private static validation({ params }: MethodParams): void {
    Guard.required(params.id, { key: 'IdRequired' });
    Guard.isUUID(params.id);
  }

  private async method({ params }: MethodParams): Promise<MethodResponse> {
    const {
      id,
    } = params;
    const service = new AlertListService();

    const value = await service.getById(id);

    return {
      status: Status.Success,
      value,
    };
  }

  public create(): RouteJsonController {
    return new RouteJsonController({
      path: '/:id',
      methodType: MethodType.Get,
      validation: AlertListController.validation.bind(this),
      method: this.method.bind(this),
    });
  }
}

const alertGetById = new AlertListController();

export {
  alertGetById,
};

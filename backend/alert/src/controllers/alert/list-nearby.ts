import {
  Guard,
  MethodParams,
  MethodResponse, MethodType, RouteJsonController, Session,
} from '@find-me/api';
import { Status } from '@find-me/errors';
import { AlertListService } from '@find-me/services';
import { AlertTypeEnum } from '@find-me/entities';

class AlertListNearbyController {
  private static validation({ data }: MethodParams): void {
    Guard.required(data.latitude, { key: 'LatitudeRequired' });
    Guard.isNumber(Number(data.latitude), { key: 'LatitudeInvalid' });
    Guard.required(data.longitude, { key: 'LongitudeRequired' });
    Guard.isNumber(Number(data.longitude), { key: 'LongitudeInvalid' });

    if (data.type) {
      Guard.isEnumValue(data.type, AlertTypeEnum, { key: 'InvalidAlertType', params: { type: data.type } });
    }
  }

  private async method({ data }: MethodParams, session?: Session): Promise<MethodResponse> {
    const service = new AlertListService(session);

    const {
      latitude,
      longitude,
      type,
    } = data;

    const list = await service.nearbyList(Number(latitude), Number(longitude), type);

    return {
      status: Status.Success,
      value: {
        list,
      },
    };
  }

  public create(): RouteJsonController {
    return new RouteJsonController({
      path: '/list-nearby',
      methodType: MethodType.Post,
      validation: AlertListNearbyController.validation.bind(this),
      method: this.method.bind(this),
    });
  }
}

const alertListNearby = new AlertListNearbyController();

export {
  alertListNearby,
};

import {
  Guard,
  MethodParams, MethodResponse, MethodType, RouteFileController, Session,
} from '@find-me/api';
import { Status } from '@find-me/errors';
import { AlertCreateService, Authentication } from '@find-me/services';
import { AlertLocationType, AlertTypeEnum } from '@find-me/entities';

class AlertCreateController {
  private static validation({ data }: MethodParams): void {
    Guard.required(data.name, { key: 'NameRequired' });
    Guard.required(data.description, { key: 'DescriptionRequired' });
    Guard.required(data.latitude, { key: 'LatitudeRequired' });
    Guard.isNumber(Number(data.latitude), { key: 'LatitudeInvalid' });
    Guard.required(data.longitude, { key: 'LongitudeRequired' });
    Guard.isNumber(Number(data.longitude), { key: 'LongitudeInvalid' });
    Guard.required(data.type, { key: 'AlertTypeRequired' });
    Guard.isEnumValue(data.type, AlertTypeEnum, { key: 'InvalidAlertType', params: { type: data.type } });
    Guard.required(data.birthDate, { key: 'BirthDateRequired' });
    Guard.isDate(data.birthDate);
    Guard.required(data.disappearDate, { key: 'DisappearDateRequired' });
    Guard.isDate(data.disappearDate);
  }

  private async method({
    data, file, cookies, headers,
  }: MethodParams, session?: Session): Promise<MethodResponse> {
    const user = Authentication.authenticate({ ...cookies, ...headers });
    const service = new AlertCreateService(session);

    const {
      type,
      name,
      description,
      birthDate,
      disappearDate,
      latitude,
      longitude,
      ...info
    } = data;

    const image = await file?.toBuffer();

    await service.create(
      {
        type,
        name,
        description,
        birthDate,
        disappearDate,
        location: {
          type: AlertLocationType.Point,
          coordinates: [Number(longitude), Number(latitude)],
        },
        info: {
          ...info,
          isPCD: data.isPCD === 'true',
        },
        account: user.accountId,
      },
      image!,
    );

    return {
      status: Status.Success,
      message: 'AlertCreated',
    };
  }

  public create(): RouteFileController {
    return new RouteFileController({
      path: '/create',
      methodType: MethodType.Post,
      validation: AlertCreateController.validation.bind(this),
      method: this.method.bind(this),
    });
  }
}

const alertCreate = new AlertCreateController();

export {
  alertCreate,
};

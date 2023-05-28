import { AlertLocationType, AlertTypeEnum } from '@find-me/entities';
import {
  Guard,
  MethodParams, MethodResponse, MethodType, RouteFileController, Session,
} from '@find-me/api';
import { Status } from '@find-me/errors';
import { AlertUpdateService } from '@find-me/services';

class AlertUpdateController {
  private static validation({ data, params }: MethodParams): void {
    Guard.required(params.id, { key: 'IdRequired' });
    Guard.isUUID(params.id);
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

  private async method({ data, params, file }: MethodParams, session?: Session): Promise<MethodResponse> {
    const service = new AlertUpdateService(session);

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

    await service.update(
      params.id,
      {
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
          isPCD: Boolean(data.isPCD),
        },
      },
      image,
    );

    return {
      status: Status.Success,
      message: 'AlertUpdated',
    };
  }

  public create(): RouteFileController {
    return new RouteFileController({
      path: '/update/:id',
      methodType: MethodType.Put,
      validation: AlertUpdateController.validation.bind(this),
      method: this.method.bind(this),
    });
  }
}

const alertUpdate = new AlertUpdateController();

export {
  alertUpdate,
};

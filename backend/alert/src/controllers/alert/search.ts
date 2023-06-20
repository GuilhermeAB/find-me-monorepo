import {
  Guard,
  MethodParams,
  MethodResponse, MethodType, RouteJsonController,
} from '@find-me/api';
import { Status } from '@find-me/errors';
import { AlertSearchService } from '@find-me/services';
import { AlertStatus, AlertTypeEnum } from '@find-me/entities';

class AlertSearchController {
  private static validation({ data }: MethodParams): void {
    Guard.isString(data.search, { key: 'SearchTextInvalid' }, true);
    Guard.required(data.status, { key: 'StatusRequired' });
    Guard.isEnumValue(data.status, AlertStatus, { key: 'InvalidAlertStatus', params: { type: data.status } });
    Guard.isNumber(data.startAge, { key: 'StartDateInvalid' }, true);
    Guard.isNumber(data.endAge, { key: 'EndDateInvalid' }, true);
    Guard.isNumber(data.missingAgeStart, { key: 'MissingDateStartInvalid' }, true);
    Guard.isNumber(data.missingAgeEnd, { key: 'MissingDateEndInvalid' }, true);

    if (data.type) {
      Guard.isEnumValue(data.type, AlertTypeEnum, { key: 'InvalidAlertType', params: { type: data.type } });
    }
  }

  private async method({ data }: MethodParams): Promise<MethodResponse> {
    const service = new AlertSearchService();

    const {
      search,
      status,
      type,
      startAge,
      endAge,
      missingAgeStart,
      missingAgeEnd,
    } = data;

    const list = await service.search(
      {
        status,
        type,
        startAge: startAge !== undefined ? Number(startAge) : undefined,
        endAge: endAge !== undefined ? Number(endAge) : undefined,
        missingAgeStart: missingAgeStart !== undefined ? Number(missingAgeStart) : undefined,
        missingAgeEnd: missingAgeEnd !== undefined ? Number(missingAgeEnd) : undefined,
      },
      search,
    );

    return {
      status: Status.Success,
      value: {
        list,
      },
    };
  }

  public create(): RouteJsonController {
    return new RouteJsonController({
      path: '/search',
      methodType: MethodType.Post,
      method: this.method.bind(this),
      validation: AlertSearchController.validation.bind(this),
    });
  }
}

const alertSearch = new AlertSearchController();

export {
  alertSearch,
};

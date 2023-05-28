import { ApiServer, RouteController } from 'adapters/api';
import {
  alertCreate,
  alertImageGetByAlertId,
  alertList,
  alertUpdate,
  alertListNearby,
  alertGetById,
} from './controllers';

class AlertAPI {
  private static routes(): RouteController[] {
    return [
      alertCreate.create(),
      alertList.create(),
      alertImageGetByAlertId.create(),
      alertUpdate.create(),
      alertListNearby.create(),
      alertGetById.create(),
    ];
  }

  public static async create(): Promise<void> {
    const server = new ApiServer({
      prefix: '/alert',
      port: 3000,
      routes: AlertAPI.routes(),
    });

    await server.start();
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
AlertAPI.create();

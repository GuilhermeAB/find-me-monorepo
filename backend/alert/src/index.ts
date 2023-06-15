import { ApiServer, RouteController } from 'adapters/api';
import {
  alertCreate,
  alertImageGetByAlertId,
  alertList,
  alertListByUser,
  alertUpdate,
  alertListNearby,
  alertGetById,
  commentCreate,
  commentCreateReply,
  commentList,
  health,
} from './controllers';

class AlertAPI {
  private static routes(): RouteController[] {
    return [
      health.create(),
      alertCreate.create(),
      alertList.create(),
      alertListByUser.create(),
      alertImageGetByAlertId.create(),
      alertUpdate.create(),
      alertListNearby.create(),
      alertGetById.create(),
      commentCreate.create(),
      commentCreateReply.create(),
      commentList.create(),
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

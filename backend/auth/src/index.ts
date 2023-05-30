import { ApiServer, RouteController } from 'adapters/api';
import {
  accountCreate,
} from './controllers';

class AuthAPI {
  private static routes(): RouteController[] {
    return [
      accountCreate.create(),
    ];
  }

  public static async create(): Promise<void> {
    const server = new ApiServer({
      prefix: '/auth',
      port: 3001,
      routes: AuthAPI.routes(),
    });

    await server.start();
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
AuthAPI.create();

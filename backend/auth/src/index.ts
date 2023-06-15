import { ApiServer, RouteController } from 'adapters/api';
import {
  health,
  accountCreate,
  accountSignIn,
  accountLoggedUser,
  accountUpdatePassword,
  accountUpdatePerson,
} from './controllers';

class AuthAPI {
  private static routes(): RouteController[] {
    return [
      health.create(),
      accountCreate.create(),
      accountSignIn.create(),
      accountLoggedUser.create(),
      accountUpdatePassword.create(),
      accountUpdatePerson.create(),
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

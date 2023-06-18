import { ApiServer, RouteController } from 'adapters/api';
import {
  health,
  accountCreate,
  accountSignIn,
  accountLoggedUser,
  accountUpdatePassword,
  accountUpdatePerson,
  accountSignOut,
  accountActivation,
  accountActivationRequest,
  accountPasswordRecover,
  accountPasswordRecoverRequest,
} from './controllers';

class AuthAPI {
  private static routes(): RouteController[] {
    return [
      health.create(),
      accountCreate.create(),
      accountSignIn.create(),
      accountSignOut.create(),
      accountLoggedUser.create(),
      accountUpdatePassword.create(),
      accountUpdatePerson.create(),
      accountActivation.create(),
      accountActivationRequest.create(),
      accountPasswordRecover.create(),
      accountPasswordRecoverRequest.create(),
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

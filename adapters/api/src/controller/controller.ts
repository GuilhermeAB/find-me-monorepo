import {
  FastifyReply, FastifyRequest,
} from 'fastify';
import { Database, DatabaseConnection, Session } from '@find-me/database';
import { MethodParams, RouteController } from './controller.base';

export class RouteJsonController extends RouteController {
  protected async executeRequest(request: FastifyRequest, response: FastifyReply): Promise<void> {
    let database: {
      connection: DatabaseConnection,
      session: Session,
    } | undefined;

    try {
      const params: MethodParams = {
        params: request.params as Record<string, string>,
        data: {
          ...request.body as Record<string, string>,
          ...(request.query as Record<string, string>),
        },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
        cookies: request.cookies && Object.keys(request.cookies).length ? request.cookies : undefined,
        headers: request.headers,
      };

      if (this.props.validation) {
        this.props.validation(params);
      }

      database = await RouteController.getDatabase().startTransaction();

      const {
        status, message, value, token,
      } = await this.props.method(params, database.session);

      await Database.commitTransaction(database.session, database.connection);

      if (token) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        response.setCookie('authentication', token, {
          domain: process.env.URL_DOMAIN,
          path: '/',
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
        });
      }

      await this.requestSuccessHandler(response, status, message, value);
    } catch (err) {
      if (database) {
        await Database.abortTransaction(database.session, database.connection);
      }

      await this.requestErrorHandler(response, err as Error);
    }
  }
}

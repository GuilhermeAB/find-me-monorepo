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
      };

      if (this.props.validation) {
        this.props.validation(params);
      }

      database = await RouteController.getDatabase().startTransaction();

      const {
        status, message, value,
      } = await this.props.method(params, database.session);

      await Database.commitTransaction(database.session, database.connection);

      await this.requestSuccessHandler(response, status, message, value);
    } catch (err) {
      if (database) {
        await Database.abortTransaction(database.session, database.connection);
      }

      await this.requestErrorHandler(response, err as Error);
    }
  }
}

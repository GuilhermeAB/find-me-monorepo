import {
  FastifyReply, FastifyRequest,
} from 'fastify';
import { Database, DatabaseConnection, Session } from '@find-me/database';
import { MultipartFile } from '@fastify/multipart';
import { MethodParams, RouteController } from './controller.base';

export class RouteFileController extends RouteController {
  protected async executeRequest(request: FastifyRequest & { body: Record<string, { value: string }> & { file: MultipartFile } }, response: FastifyReply): Promise<void> {
    let database: {
      connection: DatabaseConnection,
      session: Session,
    } | undefined;

    try {
      const {
        file,
        ...body
      } = Object.fromEntries(
        Object.keys(request.body).map((key) => [key, request.body[key].value]),
      );

      const params: MethodParams = {
        params: request.params as Record<string, string>,
        data: {
          ...body,
          ...(request.query as Record<string, string>),
        },
        file: request.body.file,
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

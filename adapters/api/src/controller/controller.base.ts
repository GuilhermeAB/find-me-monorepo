import { MultipartFile } from '@fastify/multipart';
import { Session, Database } from '@find-me/database';
import { Status, ValidationError } from '@find-me/errors';
import { I18nHandler } from '@find-me/i18n';
import {
  FastifyInstance, FastifyReply, FastifyRequest, RouteHandlerMethod,
} from 'fastify';

export enum MethodType {
  Post = 'post',
  Put = 'put',
  Get = 'get',
  Patch = 'patch',
  Delete = 'delete',
}

export interface MethodParams {
  params: Record<string, string>,
  data: Record<string, string>,
  cookies?: Record<string, string>,
  headers?: Record<string, string | string[] | undefined>,
  file?: MultipartFile,
}

export interface MethodResponse {
  status: Status,
  message?: string,
  value?: unknown,
  token?: string,
  clearCookies?: string[],
}

interface RouteControllerProps {
  path: string,
  methodType: MethodType,
  method: (params: MethodParams, session?: Session) => Promise<MethodResponse>,
  validation?: (params: MethodParams) => void,
  i18nHandler: I18nHandler,
}

type CreateRouteControllerProps = Omit<RouteControllerProps, 'i18nHandler'>;

export abstract class RouteController {
  protected props: RouteControllerProps;

  constructor(props: CreateRouteControllerProps) {
    this.props = {
      ...props,
      i18nHandler: new I18nHandler(),
    };
  }

  protected abstract executeRequest(request: FastifyRequest, response: FastifyReply): Promise<void>;

  protected static getDatabase(): Database {
    const {
      DATABASE_URI,
    } = process.env;

    if (!DATABASE_URI) {
      throw new ValidationError({ key: 'InvalidEnv' });
    }

    const database = new Database({
      uri: DATABASE_URI,
    });

    return database;
  }

  private requestHandler(): RouteHandlerMethod {
    return async (request: FastifyRequest, response: FastifyReply): Promise<void> => {
      await this.executeRequest(request, response);
    };
  }

  // eslint-disable-next-line class-methods-use-this
  protected async requestSuccessHandler(response: FastifyReply, status: Status, message?: string, value?: unknown): Promise<void> {
    await response.status(status).send({
      message: {
        code: message,
      },
      value,
    });
  }

  protected async requestErrorHandler(response: FastifyReply, error: Error): Promise<void> {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log(error);
    }

    if (error instanceof ValidationError) {
      const { code, message, params } = this.props.i18nHandler.getMessage(error.key, error.params);

      await response.status(error.status || Status.BadRequest).send({
        message: {
          code,
          value: message,
          params,
        },
      });
    } else {
      await response.status(Status.InternalServerError).send({
        message: {
          code: 'InternalServerError',
          message: 'Internal server error',
        },
      });
    }
  }

  public async handler(server: FastifyInstance, prefix?: string): Promise<void> {
    const {
      methodType,
      path,
    } = this.props;

    const routePath = prefix ? prefix.concat(path) : `${path}`;

    switch (methodType) {
      case MethodType.Get:
        server.get(routePath, this.requestHandler());
        break;
      case MethodType.Post:
        server.post(routePath, this.requestHandler());
        break;
      case MethodType.Put:
        server.put(routePath, this.requestHandler());
        break;
      case MethodType.Patch:
        server.patch(routePath, this.requestHandler());
        break;
      case MethodType.Delete:
        server.delete(routePath, this.requestHandler());
        break;
      default:
        throw new Error(`Not supported method type: ${String(methodType)}`);
    }
  }
}

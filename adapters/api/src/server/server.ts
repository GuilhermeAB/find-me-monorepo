import fastify, { FastifyInstance } from 'fastify';
import { config } from 'dotenv';
import multipart from '@fastify/multipart';
import cookie, { FastifyCookieOptions } from '@fastify/cookie';
import cors from '@fastify/cors';
import { RouteController } from '../controller/controller.base';
import { RouteFileController } from '../controller';
// import { privateKey } from '../cert/private-key';
// import { certificate } from '../cert/certificate';

const DEFAULT_PORT = 3000;

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

interface ApiServerProps {
  server: FastifyInstance,
  prefix?: string,
  port: number,
  routes: RouteController[],
}

type CreateApiServerProps = Optional<Omit<ApiServerProps, 'server'>, 'port'>;

export class ApiServer {
  private props: ApiServerProps;

  constructor(create: CreateApiServerProps) {
    config();

    this.props = {
      ...create,
      port: create.port || DEFAULT_PORT,
      server: fastify({
        logger: true,
        // https: {
        //   key: privateKey,
        //   cert: certificate,
        // },
      }),
    };

    this.initRoutes();
  }

  private initRoutes(): void {
    const {
      prefix,
      server,
      routes,
    } = this.props;

    routes.map((route) => route.handler(server, prefix));
  }

  private async registerPlugins(): Promise<void> {
    const {
      routes,
      server,
    } = this.props;

    if (routes.find((route) => route instanceof RouteFileController)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await server.register(multipart, {
        attachFieldsToBody: true,
        limits: {
          fieldNameSize: 100, // Max field name size in bytes
          fieldSize: 1000, // Max field value size in bytes
          fields: 20, // Max number of non-file fields
          fileSize: 2100000, // For multipart forms, the max file size in bytes
          files: 1, // Max number of file fields
          headerPairs: 2000, // Max number of header key=>value pairs
          parts: 1000, // For multipart forms, the max number of parts (fields + files)
        },
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
    await server.register(cookie as any, {
      secret: 'authorization',
    } as FastifyCookieOptions);

    if (process.env.CORS_ORIGIN_URL) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await server.register(cors, {
        origin: [process.env.CORS_ORIGIN_URL, /\.find-me-project\.com$/],
        credentials: true,
      });
    }
  }

  public async start(): Promise<void> {
    const {
      port,
      server,
    } = this.props;

    await this.registerPlugins();

    await server.listen({
      port,
      host: '0.0.0.0',
    });
  }
}

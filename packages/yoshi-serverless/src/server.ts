import path from 'path';
import { parse as parseUrl } from 'url';
// @ts-ignore - missing types
import fs from 'fs-extra';
import globby from 'globby';
import importFresh from 'import-fresh';
import { WebRequest, FunctionContext } from '@wix/serverless-api';
import { ROUTES_BUILD_DIR, BUILD_DIR } from 'yoshi-config/build/paths';
import { RouteFunction, InitServerFunction } from './types';
import {
  pathMatch,
  connectToYoshiServerHMR,
  buildRoute,
  HttpError,
} from './utils';
import nonWebpackRequireFresh from './non-webpack-require-fresh';

export type Route = {
  route: string;
  handler: (req: WebRequest, params: { [param: string]: any }) => void;
};

export default class Server {
  private context: FunctionContext;
  private routes: Array<Route>;
  private initData: any;

  constructor(context: FunctionContext) {
    this.context = context;
    this.routes = this.createRoutes();

    if (process.env.NODE_ENV === 'development') {
      const socket = connectToYoshiServerHMR();

      socket.onmessage = async () => {
        try {
          this.routes = this.createRoutes();
        } catch (error) {
          socket.send(JSON.stringify({ success: false }));
        }

        socket.send(JSON.stringify({ success: true }));
      };
    }
  }

  static async create(context: FunctionContext) {
    const server = new Server(context);
    await server.initServer();
    return server;
  }

  private initServer: () => Promise<void> = async () => {
    const initServerPath = path.resolve(BUILD_DIR, 'init-server.js');

    if (await fs.pathExists(initServerPath)) {
      const chunk = importFresh(initServerPath) as InitServerFunction;

      this.initData = await chunk(this.context);
    }
  };

  public handle = async (req: WebRequest): Promise<any> => {
    const { pathname } = parseUrl(req.path as string, true);

    for (const { handler, route } of this.routes) {
      const params = pathMatch(
        route,
        // for Businss Manager apps, routes are mapped (in Fryingpan or BM testkit):
        // '/_api/projectName/_api_' -> '/api/_api_'
        pathname?.replace('/api/_api_', '/_api_') as string,
      );

      if (params) {
        return handler(req, params);
      }
    }

    throw new HttpError([`not found: ${req.path}`], 404);
  };

  private createRoutes(): Array<Route> {
    const routesBuildDir = path.resolve(__dirname, ROUTES_BUILD_DIR);

    const serverChunks = globby.sync('**/*.js', {
      cwd: routesBuildDir,
      absolute: true,
    });

    return serverChunks.map((absolutePath) => {
      // @ts-ignore
      const chunk = nonWebpackRequireFresh(absolutePath) as RouteFunction<any>;
      const route = buildRoute(absolutePath);
      return {
        route,
        handler: async (req, params) => {
          const fnThis = {
            context: this.context,
            req,
            params,
            initData: this.initData,
          };

          const result = await chunk.call(fnThis);
          if (result) {
            return result;
          }
        },
      };
    });
  }
}

import path from 'path';
import SockJS from 'sockjs-client';
import pathToRegexp from 'path-to-regexp';
import { ROUTES_BUILD_DIR } from 'yoshi-config/build/paths';

const routesBuildDir = path.resolve(__dirname, ROUTES_BUILD_DIR);

export class HttpError extends Error {
  public messages: Array<any>;
  public status: number;
  constructor(messages: Array<any>, status: number) {
    super();
    this.messages = messages;
    this.status = status;
  }
}

export function relativeFilePath(from: string, to: string) {
  return path.relative(from, to.replace(/\.[^/.]+$/, ''));
}

export function connectToYoshiServerHMR() {
  return new SockJS(
    `http://localhost:${process.env.HMR_PORT}/_yoshi_server_hmr_`,
  );
}
export function pathMatch(route: string, pathname: string | undefined) {
  const keys: Array<any> = [];

  const regex = pathToRegexp(route, keys, {});

  const match = regex.exec(pathname as string);

  if (!match) {
    return false;
  }

  return keys.reduce((acc, key, index) => {
    const param = match[index + 1];

    if (!param) {
      return acc;
    }

    const value = decodeURIComponent(param);

    return {
      ...acc,
      [key.name]: key.repeat ? value.split(key.delimiter) : value,
    };
  }, {});
}
export function buildRoute(absolutePath: string) {
  const relativePath = `/${relativeFilePath(routesBuildDir, absolutePath)}`;
  // Change `/users/[userid]` to `/users/:userid`
  const routePath = relativePath.replace(/\[(\w+)\]/g, ':$1');

  if (routePath === '/index') {
    return '/';
  }
  // '/app/index' -> '/app'
  if (path.basename(routePath) === 'index') {
    return routePath.replace('/index', '');
  }
  return routePath;
}

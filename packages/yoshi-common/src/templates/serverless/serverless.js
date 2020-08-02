const { Server } = require('yoshi-serverless');
const { FullHttpResponse, HttpError } = require('@wix/serverless-api');

const accessControlHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Request-Method': '*',
  'Access-Control-Allow-Headers':
    'origin, x-wix-brand, x-requested-with, content-type, accept, x-wix-scheduler-instance, authorization',
};

const isDevelopment = process.env.NODE_ENV === 'development';

const addOptionsCors = (functionsBuilder) => {
  functionsBuilder.addWebFunction('OPTIONS', '*', async () => {
    return new FullHttpResponse({
      status: 204,
      body: {},
      ...(process.env.NODE_ENV === 'development'
        ? { headers: accessControlHeaders }
        : {}),
    });
  });
};

const getHeaders = () => {
  let headers = { 'content-type': 'application/json' };
  if (isDevelopment) {
    headers = { ...accessControlHeaders, ...headers };
  }
  return headers;
};

module.exports = (functionsBuilder) => {
  if (isDevelopment) {
    addOptionsCors(functionsBuilder);
  }
  return functionsBuilder
    .withSecurityOptions({
      requireHttps: true,
    })
    .addWebFunction('POST', '*', async (ctx, req) => {
      try {
        const server = await Server.create(ctx);
        const result = await server.handle(req);
        const webResponse = {
          body: result,
          status: 200,
          headers: getHeaders(),
        };
        return new FullHttpResponse(webResponse);
      } catch (e) {
        if (isDevelopment) {
          const webResponse = {
            body: { errors: e.messages || [e.message] },
            status: e.status || 500,
            headers: getHeaders(),
          };
          return new FullHttpResponse(webResponse);
        }
        throw new HttpError({
          status: e.status || 500,
          message: e.messages ? e.messages[0] : e.message,
        });
      }
    })
    .addWebFunction('GET', '*', async (ctx, req) => {
      const server = await Server.create(ctx);
      const result = await server.handle(req);

      const webResponse = {
        body: result,
        status: 200,
      };
      return new FullHttpResponse(webResponse);
    });
};

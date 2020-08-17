const { Server } = require('yoshi-serverless');
const { FullHttpResponse, HttpError } = require('@wix/serverless-api');

const accessControlHeadersDev = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Request-Method': '*',
  'Access-Control-Allow-Headers':
    'origin, x-wix-brand, x-requested-with, content-type, accept, x-wix-scheduler-instance, authorization',
};
const accessControlHeadersProd = {
  'Access-Control-Allow-Origin': 'https://static.parastorage.com',
  'Access-Control-Request-Method': '*',
  'Access-Control-Allow-Headers':
    'origin, x-wix-brand, x-requested-with, content-type, accept, x-wix-scheduler-instance, authorization',
};

const isDevelopment = process.env.NODE_ENV === 'development';

const getHeaders = () => {
  return {
    ...(isDevelopment ? accessControlHeadersDev : accessControlHeadersProd),
    'content-type': 'application/json',
  };
};

module.exports = (functionsBuilder) => {
  return functionsBuilder
    .withSecurityOptions({
      requireHttps: true,
    })
    .addWebFunction('OPTIONS', '*', async () => {
      return new FullHttpResponse({
        status: 204,
        body: {},
        headers: getHeaders(),
      });
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

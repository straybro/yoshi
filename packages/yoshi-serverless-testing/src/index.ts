const { app } = require('@wix/serverless-testkit');
const { getServerlessScope } = require('yoshi-helpers/build/utils');
const config = require('yoshi-config');

// start the server as an embedded app
export const bootstrap = () => {
  const scope = getServerlessScope(config.name);

  return app(scope, { appPort: process.env.SERVERLESS_PORT });
};

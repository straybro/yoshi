const { app } = require('@wix/serverless-testkit');
const { getServerlessScope } = require('yoshi-helpers/build/utils');
const config = require('yoshi-config');
const paths = require('yoshi-config/build/paths');

// start the server as an embedded app
export const bootstrap = () => {
  const scope = getServerlessScope(config.name);

  return app({
    appPort: process.env.SERVERLESS_PORT,
    scopePath: paths.SERVERLESS_SCOPE_DIR(scope),
    scopeName: scope,
  });
};

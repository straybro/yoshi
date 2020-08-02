const { app } = require('@wix/serverless-testkit');
const { getServerlessScope } = require('yoshi-helpers/build/utils');

const scope = getServerlessScope('yoshi-serverless-testing');

// start the server as an embedded app
export const bootstrap = () => {
  return app(scope, { appPort: process.env.SERVERLESS_PORT });
};

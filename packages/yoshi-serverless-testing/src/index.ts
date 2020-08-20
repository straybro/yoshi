import { app } from '@wix/serverless-testkit';
import { AmbassadorTestkit } from '@wix/ambassador-testkit';
import { getServerlessScope } from 'yoshi-helpers/build/utils';
import config from 'yoshi-config';
import { SERVERLESS_SCOPE_DIR } from 'yoshi-config/build/paths';

export type { AmbassadorTestkit };
// start the server as an embedded app
export const bootstrap = () => {
  const scope = getServerlessScope(config.name);

  return app({
    appPort: parseInt(process.env.SERVERLESS_PORT || '', 10),
    scopePath: SERVERLESS_SCOPE_DIR(scope),
    scopeName: scope,
  });
};

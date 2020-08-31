import { route } from '..';

export default route(async function () {
  return process.env.SERVERLESS_BUILD_UNIQUE_ID;
});

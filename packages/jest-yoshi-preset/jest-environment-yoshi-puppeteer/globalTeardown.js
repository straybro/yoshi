const { shouldRunE2Es } = require('./utils');
const cdnProxy = require('./cdnProxy');
const { killSpawnProcessAndHisChildren } = require('yoshi-helpers/utils');

module.exports = async () => {
  if (await shouldRunE2Es()) {
    process.env.WS_ENDPOINT = null;

    await global.BROWSER.close();

    if (global.SERVER) {
      await killSpawnProcessAndHisChildren(global.SERVER);
    }

    await cdnProxy.stop();
  }
};

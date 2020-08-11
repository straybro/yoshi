#!/usr/bin/env node

const { spawnSync } = require('child_process');

const isPR = process.env.agentType === 'pullrequest';

if (isPR) {
  const { stdout } = spawnSync(
    `git`,
    ['diff', '--name-status', 'origin/master'],
    {
      encoding: 'UTF-8',
    },
  );

  if (!/website\/.*/.test(stdout)) {
    console.log(
      "No changes to 'website' directory detected.\nSkipping Janet preview publish",
    );

    process.exit(0);
  }
}

const janetDeploy = spawnSync('janet', ['deploy', '--ci'], {
  stdio: 'inherit',
});

if (janetDeploy.error) {
  console.error('Error while trying to publish janet site:', janetDeploy.error);
  process.exit(1);
}

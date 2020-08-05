#!/usr/bin/env node

const { spawnSync } = require('child_process');

const hasChangesInWebsiteFolder = (changedFilesNames) => {
  const pattern = /website\/.*/;
  return pattern.test(changedFilesNames);
};

const result = spawnSync(`git`, ['diff', '--name-status', 'origin/master'], {
  encoding: 'UTF-8',
});

const diff = result.stdout;

if (!hasChangesInWebsiteFolder(diff)) {
  console.log(
    "No changes to 'website' directory detected.\nSkipping Janet PR build",
  );
  return;
}

const janetDeploy = spawnSync('janet', ['deploy', '--ci'], {
  stdio: 'inherit',
});

if (janetDeploy.error) {
  console.log('Error while trying to publish janet site::', janetDeploy.error);
}

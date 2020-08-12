import fs from 'fs-extra';
import execa from 'execa';
import chalk from 'chalk';
import addNewVersionToChangelog from './changelog-utils/addVersionToChangelog';

process.env.GITHUB_AUTH = process.env.GITHUB_AUTH || process.env.github_token;

const forceOption = process.argv.indexOf('--force') !== -1;

if (!process.env.GITHUB_AUTH) {
  console.error(`Must provide GITHUB_AUTH environment parameter with a GitHub access Token
You can generate a new token using this link

https://github.com/settings/tokens/new

Assign only the "repo" scope`);
  process.exit(1);
}

console.log(`Fetching tags...`);
execa.sync('git', ['fetch', '--tags']);

const { version: currentVersion } = fs.readJSONSync('lerna.json');

const lernaVersionCommand = [
  'version',
  '--bump',
  'minor',
  '--no-push',
  '--exact',
  '--yes',
];

console.log(
  `Bumping version with ${chalk.bold(
    `lerna ${lernaVersionCommand.join(' ')}`,
  )}...`,
);

execa.sync('./node_modules/.bin/lerna', lernaVersionCommand, {
  stdio: 'inherit',
});

const { version: nextVersion } = fs.readJSONSync('lerna.json');

console.log(
  `Adding a changelog version with ${chalk.bold('lerna-changelog')}...`,
);

addNewVersionToChangelog({
  currentVersion,
  force: forceOption,
});

execa.sync('git', ['add', 'CHANGELOG.md'], { stdio: 'inherit' });
execa.sync('git', ['commit', '-m', `changelog for v${nextVersion}`], {
  stdio: 'inherit',
});

console.log(
  chalk.green(`✔ New version & changelog were created: v${nextVersion}`),
);
console.log(`To publish this version push with tags\n`);
console.log(chalk.bold(`git push --follow-tags origin master`));

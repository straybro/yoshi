import { promises as fs } from 'fs';
import execa from 'execa';
import chalk from 'chalk';
// https://github.com/wix-a/changelog-prepend
import { prependChangelog } from 'changelog-prepend/lib/prependChangelog';

process.env.GITHUB_AUTH = process.env.GITHUB_AUTH || process.env.github_token;

main();

async function main() {
  try {
    if (!process.env.GITHUB_AUTH) {
      throw new Error('Must provide GITHUB_AUTH');
    }

    const { version: prevVersion } = JSON.parse(
      (await fs.readFile('lerna.json')).toString('utf8'),
    );

    console.log(`Bumping version with ${chalk.bold('lerna version')}...`);

    await execa('./node_modules/.bin/lerna', [
      'version',
      '--bump',
      'minor',
      '--no-push',
      '--exact',
      '--yes',
    ]);

    const { version: nextVersion } = JSON.parse(
      (await fs.readFile('lerna.json')).toString('utf8'),
    );

    console.log(
      `Generating & prepending changelog with ${chalk.bold(
        'lerna-changelog',
      )}...`,
    );

    await prependChangelog({
      prevVersion,
    });

    console.log(
      chalk.green(`✔ New version & changelog were created: v${nextVersion}`),
    );
    console.log(
      `To publish this version push with tags: ${chalk.bold(
        `git push --follow-tags origin master`,
      )}`,
    );
  } catch (err) {
    console.log(chalk.red('prepend-changelog failed.'));
    console.error(err);
    console.log();

    process.exit(1);
  }
}

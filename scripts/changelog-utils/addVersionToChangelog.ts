import fs from 'fs';
import execa from 'execa';
import chalk from 'chalk';

const EOL = '\n';
const BLANK_LINE = EOL + EOL;
const CHANGELOG_FILE_NAME = 'CHANGELOG.md';
const COMMITTERS_HEADER = '#### Committers';
const CHANGELOG_HEADER = ['# Changelog'].join(EOL);

export default function addNewVersionToChangelog({
  currentVersion,
  force = false,
}: {
  force?: boolean;
  currentVersion: string;
}) {
  const newVersionSection = generateNewVersionSection(currentVersion, {
    force,
  });

  const currentChangelog = fs.readFileSync(CHANGELOG_FILE_NAME, 'utf8');

  const endOfHeaderIndex =
    currentChangelog.indexOf(CHANGELOG_HEADER) +
    CHANGELOG_HEADER.length +
    BLANK_LINE.length;

  const newChangelog =
    [
      CHANGELOG_HEADER,
      newVersionSection,
      currentChangelog.substring(endOfHeaderIndex),
    ]
      .join(BLANK_LINE)
      .trim() + EOL;

  fs.writeFileSync(CHANGELOG_FILE_NAME, newChangelog);
}

function generateNewVersionSection(
  prevVersion: string,
  options: { force: boolean },
): string {
  const lernaChangelogCommand = [
    'lerna-changelog',
    '--from',
    `v${prevVersion}`,
    '--next-version-from-metadata',
  ];

  let { stdout: newVersionSection } = execa.sync('npx', lernaChangelogCommand);

  if (newVersionSection === 'Must provide GITHUB_AUTH') {
    console.error(newVersionSection);
    process.exit(1);
  }

  if (newVersionSection.trim() === '') {
    if (!options.force) {
      console.error(
        chalk.red(`Couldn't generate a new changelog section.
this may occure when there are no relevant tags for lerna-changelog to create the version
it may also happen if something didn't work as expected with lerna changelog
you can run the following to debug the problem:

  ${chalk.white(`>  npx ${lernaChangelogCommand.join(' ')}`)}

or instead use the following to create the version without the changelog:

  ${chalk.white(`>  yarn manual-release --force`)}`),
      );

      process.exit(1);
    }
  }

  const committersHeaderIndex = newVersionSection.indexOf(COMMITTERS_HEADER);

  if (committersHeaderIndex !== -1) {
    newVersionSection = newVersionSection.substring(0, committersHeaderIndex);
  }

  return newVersionSection.trim();
}

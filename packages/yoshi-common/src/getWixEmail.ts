import getGitConfig from 'parse-git-config';

const WIX_EMAIL_PATTERN = '@wix.com';

export default () => {
  const processUser = process.env.USER;
  const { email: gitEmail } = getGitConfig.sync({
    include: true,
    type: 'global',
  });

  // Use email from git config | OS username or empty string as an initial value.
  if (gitEmail?.endsWith(WIX_EMAIL_PATTERN)) {
    return gitEmail;
  } else if (processUser) {
    return `${processUser}${WIX_EMAIL_PATTERN}`;
  }

  return 'not-found';
};

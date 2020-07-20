export const WIX_EMAIL_PATTERN = '@wix.com';

// Check if string is an email address
export const isEmail = (value: string) => value.length && !/@+/.test(value);

// Use email from git config | OS username or empty string as an initial value.
export const getInitialEmail = (gitEmail: string) => {
  const processUser = process.env.USER;
  if (gitEmail.endsWith(WIX_EMAIL_PATTERN)) {
    return gitEmail;
  } else if (processUser) {
    return `${processUser}@wix.com`;
  }
  return '';
};

// Format `value` to `value@wix.com` or use original value if it's already contains @wix.com.
export const formatEmail = (email: string) => {
  if (!email.endsWith(WIX_EMAIL_PATTERN)) {
    return `${email}@wix.com`;
  }
  return email;
};

import { method } from 'yoshi-serverless';

export const greet = method(function (name: string) {
  return {
    greeting: `hello ${name}`,
  };
});

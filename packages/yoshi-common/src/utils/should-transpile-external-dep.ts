import config from 'yoshi-config';

// accepts a file path and return true if it's a dep that needs to be transpiled
export default (fileName: string): boolean => {
  const externalRegexList = config.externalUnprocessedModules.map(
    (m) => new RegExp(`node_modules/${m}`),
  );

  return externalRegexList.some((regex) => regex.test(fileName));
};

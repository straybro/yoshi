import { isAbsolute } from 'path';
import globby from 'globby';
import { register } from 'ts-node';

const originalJsHandler = require.extensions['.js'];

const { extensions } = register({
  fast: true,
  compilerOptions: {
    // force commonjs modules
    module: 'commonjs',
    // allow using Promises, Array.prototype.includes, String.prototype.padStart, etc.
    lib: ['es2017'],
    // use async/await instead of embedding polyfills
    target: 'es2017',
  },
});

const cwd = process.cwd();
// don't transpile with ts-node/register files ignored by git
const shouldBeGitIgnore = globby.gitignore.sync({ cwd });

// `ts-node` only supports regex ignore patterns, use custom extensions so functions can
// be used
if (extensions.includes('.js')) {
  const originalTsNodeHandler = require.extensions['.js'];

  require.extensions['.js'] = function (m, filename) {
    // do not run ts-node on absolute path files outside of current working directory
    if (isAbsolute(filename) && !filename.startsWith(cwd)) {
      return originalJsHandler(m, filename);
      // do not run ts-node on files ignored by gitignore
    } else if (shouldBeGitIgnore(filename)) {
      return originalJsHandler(m, filename);
    }

    return originalTsNodeHandler(m, filename);
  };
}

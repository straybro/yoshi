import createBabelConfig from '../create-babel-config';
import shouldTranspileFile from '../utils/should-transpile-file';
import shouldTranspileExternalDep from '../utils/should-transpile-external-dep';

const babelConfig = createBabelConfig();

require('@babel/register')({
  only: [shouldTranspileFile, shouldTranspileExternalDep],
  ...babelConfig,
});

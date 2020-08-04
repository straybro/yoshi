const readPkg = require('read-pkg');

const shouldUseEditorFlow = () => {
  const pkgJson = readPkg.sync({ cwd: process.cwd() });
  const { devDependencies = [], dependencies = [] } = pkgJson;

  return (
    devDependencies['yoshi-flow-editor'] || dependencies['yoshi-flow-editor']
  );
};

module.exports = {
  shouldUseEditorFlow,
};

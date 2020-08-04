const loadJestYoshiConfig = require('yoshi-config/build/jest').default;
const { shouldUseEditorFlow } = require('./defaults/editor-flow');

// We want to remove jest-yoshi-config usage from user's side, but we don't want to break current projects.
// The idea is to handle it here and load correct jest config using this function from all jest configuration files.
module.exports = () => {
  if (shouldUseEditorFlow()) {
    return require('./defaults/editor-flow-config');
  } else {
    return loadJestYoshiConfig();
  }
};

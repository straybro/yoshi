try {
  const {
    default: updateBILoggerDefinitions,
  } = require('./build/biLoggerDefinitions');
  const { default: createFlowBMModel } = require('./build/model');
  const { shouldAddBI } = require('./build/queries');

  const model = createFlowBMModel();

  if (shouldAddBI(model)) {
    updateBILoggerDefinitions(model);
  }
} catch (e) {
  console.warn(e);
}

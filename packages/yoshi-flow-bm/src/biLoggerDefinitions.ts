import fs from 'fs-extra';
import { FlowBMModel } from './model';
import { BI_LOGGER_DEFINITIONS_PATH } from './constants';

const generateBILoggerDefinitions = (model: FlowBMModel) => `
export { Logger } from '${model.config.bi}';
`;

const updateBILoggerDefinitions = (model: FlowBMModel) => {
  fs.outputFileSync(
    BI_LOGGER_DEFINITIONS_PATH,
    generateBILoggerDefinitions(model),
  );
};

export default updateBILoggerDefinitions;

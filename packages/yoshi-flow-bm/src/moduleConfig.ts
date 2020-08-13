import path from 'path';
import * as fs from 'fs-extra';
import {
  getProjectArtifactId,
  getProjectGroupId,
} from 'yoshi-helpers/build/utils';
import { AppConfigTemplate } from '@wix/ambassador-service-discovery-server/types';
import { FlowBMModel } from './model';
import { getModuleConfigPath } from './constants';
import { getRootModuleId } from './queries';

export const generateModuleConfig = (model: FlowBMModel): AppConfigTemplate => {
  const {
    pages,
    config: { appDefId, topology, moduleBundleName },
  } = model;

  const artifactId = `${getProjectGroupId()}.${getProjectArtifactId()}`;
  const pageComponents = pages.map(({ componentId, componentName, route }) => ({
    pageComponentId: componentId,
    pageComponentName: componentName,
    route,
  }));

  return {
    moduleId: getRootModuleId(model),
    appDefId,
    mainPageComponentId: pageComponents.reduce((prev, { route, ...rest }) =>
      route.split('/').length > prev.route.split('/').length
        ? prev
        : { ...rest, route },
    ).pageComponentId,
    pageComponents,

    config: { topology },
    bundles: [
      {
        file: {
          artifactId,
          path: `${moduleBundleName}.bundle.min.js`,
        },
        debugFile: {
          artifactId,
          path: `${moduleBundleName}.bundle.js`,
        },
      },
    ],
  };
};

export const renderModuleConfig = (model: FlowBMModel) => {
  const template = generateModuleConfig(model);

  const templatePath = path.join(
    process.cwd(),
    getModuleConfigPath(template.moduleId!),
  );

  fs.outputJSONSync(templatePath, template, { spaces: 2 });
};

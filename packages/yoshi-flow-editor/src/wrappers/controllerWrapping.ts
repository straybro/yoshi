import path from 'path';
import fs from 'fs-extra';
import { FlowEditorModel, ComponentModel } from '../model';
import { resolveBILoggerPath, getDefaultTranslations } from '../utils';
import controllerEntry from './templates/ControllerEntry';

const controllerWrapperPath =
  'yoshi-flow-editor-runtime/build/controllerWrapper.js';

const controllersWrapper = (
  generatedWidgetEntriesPath: string,
  model: FlowEditorModel,
) => {
  return model.components.reduce(
    (acc: Record<string, string>, component: ComponentModel) => {
      const generatedWidgetEntryPath = path.join(
        generatedWidgetEntriesPath,
        `${component.name}Controller.js`,
      );

      let visitorBiLoggerPath = null;

      if (model.biConfig?.visitor) {
        visitorBiLoggerPath = resolveBILoggerPath(
          model.biConfig.visitor,
          'visitor',
        );
      }

      const generateControllerEntryContent = controllerEntry({
        controllerWrapperPath,
        sentryConfig: model.sentry,
        defaultTranslations: getDefaultTranslations(model),
        controllerFileName: component.viewerControllerFileName,
        experimentsConfig: model.experimentsConfig,
        appName: model.appName,
        visitorBiLoggerPath,
        projectName: model.projectName,
        biConfig: model.biConfig,
        translationsConfig: model.translationsConfig,
      });

      fs.outputFileSync(
        generatedWidgetEntryPath,
        generateControllerEntryContent,
      );
      // Generate controllers for each widget.
      acc[`${component.name}Controller`] = generatedWidgetEntryPath;

      return acc;
    },
    {},
  );
};

export default controllersWrapper;

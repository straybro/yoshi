import path from 'path';
import fs from 'fs-extra';
import { FlowEditorModel, ComponentModel } from '../model';
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

      const generateControllerEntryContent = controllerEntry({
        controllerWrapperPath,
        controllerFileName: component.viewerControllerFileName,
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

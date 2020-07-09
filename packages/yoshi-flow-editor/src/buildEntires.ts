import path from 'path';
import writeComponentWrapping from './wrappers/componentWrapping';
import writeEditorAppWrapping from './wrappers/editorAppWrapping';
import writeSettingsWrapping from './wrappers/settingsWrapping';
import writeCommonEditorScriptWrapping from './wrappers/commonEditorScriptWrapping';
import writeWidgetViewerScriptWrapping from './wrappers/widgetViewerScriptWrapping';
import writeCommonViewerScriptWrapping from './wrappers/commonViewerScriptWrapping';
import wixPrivateMockWrapping from './wrappers/wixPrivateMockWrapping';
import { FlowEditorModel } from './model';

const generatedWidgetEntriesPath = path.resolve(
  __dirname,
  '../.custom-entries',
);

export const buildViewerEntries = (model: FlowEditorModel) => {
  const componentEntries = writeComponentWrapping(
    generatedWidgetEntriesPath,
    model,
  );

  return {
    ...componentEntries,
  };
};

export const buildEditorEntries = (model: FlowEditorModel) => {
  const editorAppEntries = writeEditorAppWrapping(
    generatedWidgetEntriesPath,
    model,
  );
  const settingsEntries = writeSettingsWrapping(
    generatedWidgetEntriesPath,
    model,
  );

  const wixPrivateMockEntry = wixPrivateMockWrapping();

  return {
    ...wixPrivateMockEntry,
    ...editorAppEntries,
    ...settingsEntries,
  };
};

export const buildClientEntries = (model: FlowEditorModel) => {
  return {
    ...buildEditorEntries(model),
    ...buildViewerEntries(model),
  };
};

export const buildWorkerEntries = (model: FlowEditorModel) => {
  return {
    ...writeWidgetViewerScriptWrapping(generatedWidgetEntriesPath, model),
    ...writeCommonViewerScriptWrapping(generatedWidgetEntriesPath, model),
    ...writeCommonEditorScriptWrapping(generatedWidgetEntriesPath, model),
  };
};

export const webWorkerExternals = {
  lodash: 'root _',
};

import path from 'path';
import fs from 'fs-extra';
import { FlowEditorModel, ComponentModel } from '../model';
import { getDefaultTranslations, resolveBILoggerPath } from '../utils';
import settingsEntryTemplate from './templates/SettingsAppEntryContent';

const settingsWrapperPath =
  'yoshi-flow-editor-runtime/build/SettingsWrapper.js';
const baseUIPath =
  'yoshi-flow-editor-runtime/build/styles/wix-base-ui.global.scss';

const generateSettingsEntry = ({
  generatedWidgetEntriesPath,
  entryFilename,
  model,
  ownerBiLoggerPath,
  componentFileName,
}: {
  generatedWidgetEntriesPath: string;
  component: ComponentModel;
  model: FlowEditorModel;
  ownerBiLoggerPath: string | null;
  componentFileName: string;
  entryFilename: string;
}) => {
  const generatedWidgetEntryPath = path.join(
    generatedWidgetEntriesPath,
    entryFilename,
  );

  const generateSettingsEntryContent = settingsEntryTemplate({
    settingsWrapperPath,
    baseUIPath,
    biConfig: model.biConfig,
    appName: model.appName,
    projectName: model.projectName,
    ownerBiLoggerPath,
    experimentsConfig: model.experimentsConfig,
    translationsConfig: model.translationsConfig,
    defaultTranslations: getDefaultTranslations(model),
    sentry: model.sentry,
    componentFileName,
  });

  fs.outputFileSync(generatedWidgetEntryPath, generateSettingsEntryContent);
  return generatedWidgetEntryPath;
};

const settingsWrapper = (
  generatedWidgetEntriesPath: string,
  model: FlowEditorModel,
) => {
  let ownerBiLoggerPath: string | null = null;

  if (model.biConfig?.owner) {
    ownerBiLoggerPath = resolveBILoggerPath(model.biConfig.owner, 'owner');
  }

  return model.components.reduce(
    (acc: Record<string, string>, component: ComponentModel) => {
      if (component.settingsFileName) {
        acc[`${component.name}SettingsPanel`] = generateSettingsEntry({
          generatedWidgetEntriesPath,
          component,
          ownerBiLoggerPath,
          model,
          componentFileName: component.settingsFileName,
          entryFilename: `${component.name}SettingsPanel.js`,
        });

        acc[`${component.name}SettingsPanel.mobile`] = generateSettingsEntry({
          generatedWidgetEntriesPath,
          model,
          component,
          ownerBiLoggerPath,
          componentFileName:
            component.settingsMobileFileName || component.settingsFileName,
          entryFilename: `${component.name}SettingsPanel.mobile.js`,
        });
      }

      return acc;
    },
    {},
  );
};

export default settingsWrapper;

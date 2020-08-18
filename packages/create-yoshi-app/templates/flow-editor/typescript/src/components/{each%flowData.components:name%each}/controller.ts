import {
  CreateControllerFn,
  ControllerParams,
} from 'yoshi-flow-editor-runtime';
import { getSettingsValues } from '@wix/tpa-settings';
import { componentSettings } from './componentSettings';

const createController: CreateControllerFn = async ({
  flowAPI,
}: ControllerParams) => {
  const { setProps } = flowAPI.controllerConfig;

  const publicData = flowAPI.controllerConfig.config.publicData.COMPONENT || {};
  const settings = getSettingsValues(publicData, componentSettings, {
    t: flowAPI.translations.t,
  });

  return {
    async pageReady() {
      setProps({
        greetingsText: settings.greetingsText,
      });
    },
    updateConfig($w, config) {
      const updatedPublicData = config.publicData.COMPONENT || {};
      const updatedSettings = getSettingsValues(
        updatedPublicData,
        componentSettings,
        { t: flowAPI.translations.t },
      );

      setProps({
        greetingsText: updatedSettings.greetingsText,
      });
    },
  };
};

export default createController;

import React from 'react';
import { IWixStatic } from '@wix/native-components-infra/dist/src/types/wix-sdk';
import {
  WixSDK,
  translate,
  withExperiments,
  InjectedTranslateProps,
  InjectedExperimentsProps,
} from 'yoshi-flow-editor-runtime';
import { TpaSettingsProvider } from '@wix/tpa-settings/dist/src/contexts';
import { SettingsTabLayout } from '@wix/tpa-settings/dist/src/components';

import './Settings.global.scss';

import { MainTab } from './Tabs/MainTab';
import { DesignTab } from './Tabs/DesignTab';

type ISettingsProps = InjectedTranslateProps & InjectedExperimentsProps;

export default translate()(
  withExperiments<ISettingsProps>(({ t, experiments }) => (
    <WixSDK isEditor>
      {({ Wix }) => (
        <TpaSettingsProvider Wix={Wix} t={t}>
          <SettingsTabLayout dataHook="settings-tabs" Wix={Wix}>
            {experiments.enabled('specs.test.HideMainTab') ? null : (
              <SettingsTabLayout.Tab
                title={t('app.settings.tabs.main')}
                dataHook="main-tab-button"
                articleId="xxx-xxx-xxx-xxx"
                Component={() => <MainTab />}
              />
            )}
            <SettingsTabLayout.Tab
              title={t('app.settings.tabs.design')}
              dataHook="design-tab-button"
              articleId="xxx-xxx-xxx-xxx"
              Component={() => <DesignTab />}
            />
          </SettingsTabLayout>
        </TpaSettingsProvider>
      )}
    </WixSDK>
  )),
);

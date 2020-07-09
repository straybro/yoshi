import Experiments from '@wix/wix-experiments';
import { IWidgetControllerConfig } from '@wix/native-components-infra/dist/src/types/types';
import {
  controllerConfigMock,
  controllerFlowAPIMock,
} from 'yoshi-flow-editor-runtime/test';
import {
  appName,
  experiments as experimentsConfig,
} from '../../../.application.json';
import mockExperiments from '../../../__tests__/helpers/experiments.mock';
import createAppController from './controller';

describe('createController', () => {
  it('should call setProps with data', async () => {
    const experiments = new Experiments({
      experiments: { 'specs.test.ShouldShowButton': 'true' },
    });
    mockExperiments(experimentsConfig.scope, experiments.all());
    const setPropsSpy = jest.fn();
    const appDefinitionId = 'APP_DEF_ID';
    const controllerConfig: IWidgetControllerConfig = controllerConfigMock({
      setProps: setPropsSpy,
      appParams: {
        instance: '1',
        instanceId: '1',
        appDefinitionId,
        baseUrls: {
          staticsBaseUrl: 'http://some-static-url.com',
        },
      },
    });

    const flowAPI = controllerFlowAPIMock({
      experimentsConfig,
      controllerConfig,
      widgetId: 'someWidget',
      appDefinitionId,
    });

    const controller = await createAppController({
      flowAPI,
      controllerConfig,
    });

    await controller.pageReady();

    expect(setPropsSpy).toBeCalledWith({
      greetingsText: `to ${appName}`,
    });
  });
});

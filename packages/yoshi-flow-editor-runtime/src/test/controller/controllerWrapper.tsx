import { IWidgetControllerConfig } from '@wix/native-components-infra/dist/src/types/types';
import {
  default as originalControllerWrapper,
  ControllerWrapperOptions,
} from '../../controllerWrapper';
import { CreateControllerFn, IPrepopulatedData } from '../../types';

type ControllerProps = IWidgetControllerConfig & {
  context?: any;
  prepopulated?: IPrepopulatedData;
};

export function controllerWrapper<
  C extends CreateControllerFn = CreateControllerFn
>(controller: C, opts: Partial<ControllerWrapperOptions> = {}) {
  return (controllerProps: ControllerProps) => {
    const { context, prepopulated, ...controllerConfig } = controllerProps;
    const wrappedController = originalControllerWrapper(controller, {
      // We don't want editor flow to fetch data we have already fetched in external viewer script.
      sentryConfig: opts.sentryConfig ?? null,
      biConfig: opts.biConfig ?? {},
      inEditor: opts.inEditor ?? false,
      experimentsConfig: opts.experimentsConfig ?? null,
      biLogger: opts.biLogger ?? null,
      projectName: opts.projectName ?? 'test-project',
      translationsConfig: opts.translationsConfig ?? null,
      defaultTranslations: opts.defaultTranslations ?? null,
      appName: opts.appName ?? 'test-app',
    });
    return wrappedController({
      controllerConfig,
      appData: { context, __prepopulated: prepopulated },
    });
  };
}

import {
  AppConfig,
  AppConfigTemplate,
  ServiceDiscoveryServer,
} from '@wix/ambassador-service-discovery-server/http';
import {
  getProjectArtifactId,
  getProjectGroupId,
} from 'yoshi-helpers/build/utils';
import { unionWith } from 'lodash';
import { FlowBMModel } from './model';
import { generateModuleConfig } from './moduleConfig';
import { getRootModuleId } from './queries';

export const fetchModuleConfig = async (model: FlowBMModel) => {
  // Workaround for older redaxios until the following is merged:
  // https://github.com/wix-private/ambassador/pull/106
  (global as any).self = {};
  // eslint-disable-next-line import/no-extraneous-dependencies
  (global as any).fetch = require('node-fetch').default;

  const service = ServiceDiscoveryServer(
    'https://bo.wix.com/_api/service-discovery-server/',
  ).ServiceDiscoveryService();

  try {
    const { configs } = await service().getAppConfig({
      app: 'business-manager',
    });

    return configs?.find(
      (config) => getRootModuleId(model) === config.moduleId,
    );
  } catch (e) {
    throw new Error(
      "Couldn't fetch BM configs, make sure you are connected to the VPN!",
    );
  }
};

const mergeTopologies = (
  dstConfig: AppConfig = {},
  srcConfig: AppConfigTemplate,
  cdnUrl: string,
) => {
  const groupId = getProjectGroupId();
  const artifactId = getProjectArtifactId();

  const srcTopology = srcConfig?.config?.topology ?? {};
  const dstTopology = {
    ...dstConfig?.config?.topology,
  };

  Object.keys(srcTopology).forEach((key) => {
    if (srcTopology[key].artifactId === `${groupId}.${artifactId}`) {
      dstTopology[key] = cdnUrl + '/';
    } else {
      dstTopology[key] = srcTopology[key];
    }
  });

  return dstTopology;
};

const mergeBundles = (
  dstConfig: AppConfig = {},
  srcConfig: AppConfigTemplate,
  cdnUrl: string,
) => {
  const artifactId = getProjectArtifactId();

  const srcBundles = srcConfig.bundles ?? [];
  const dstBundles = [...(dstConfig.bundles ?? [])];

  srcBundles.forEach((bundle) => {
    const bundleIndex = dstBundles.findIndex((dstBundle) =>
      new RegExp(`\\/${artifactId}\\/.*\\/${bundle.file.path}$`).test(
        dstBundle.file!,
      ),
    );

    const localBundle = {
      file: `${cdnUrl}/${bundle.file.path}`,
      debugFile: `${cdnUrl}/${bundle.debugFile.path}`,
    };

    if (bundleIndex !== -1) {
      dstBundles[bundleIndex] = localBundle;
    } else {
      dstBundles.push(localBundle);
    }
  });

  return dstBundles;
};

const mergePageComponents = (
  { pageComponents: dstPageComponents = [] }: AppConfig = {},
  { pageComponents: srcPageComponents = [] }: AppConfigTemplate,
) => {
  return unionWith(
    dstPageComponents,
    srcPageComponents,
    (a, b) =>
      a.pageComponentId === b.pageComponentId &&
      a.pageComponentName === b.pageComponentName &&
      a.route === b.route,
  );
};

export const mergeConfigs = (
  model: FlowBMModel,
  cdnUrl: string,
  prodConfig?: AppConfig,
): AppConfig => {
  const localConfig = generateModuleConfig(model);

  const topology = mergeTopologies(prodConfig, localConfig, cdnUrl);
  const bundles = mergeBundles(prodConfig, localConfig, cdnUrl);
  const pageComponents = mergePageComponents(prodConfig, localConfig);

  return {
    ...prodConfig,
    ...localConfig,
    config: {
      ...(prodConfig?.config ?? {}),
      topology,
    },
    bundles,
    pageComponents,
  };
};

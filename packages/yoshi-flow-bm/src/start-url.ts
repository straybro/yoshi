import { getProjectArtifactId } from 'yoshi-helpers/build/utils';
import { Config } from 'yoshi-config/build/config';
import {
  AppConfig,
  AppConfigTemplate,
} from '@wix/ambassador-service-discovery-server/http';
import { FlowBMModel, PageModel } from './model';
import { mergeConfigs } from './bm-configs';

const getStaticOverrides = (cdnUrl: string) => {
  const artifactId = getProjectArtifactId()!;

  return { [artifactId]: cdnUrl };
};

const getStartUrl = (
  model: FlowBMModel,
  { route }: PageModel,
  cdn: Config['servers']['cdn'],
  metaSiteId: string,
  prodConfig?: AppConfig,
) => {
  const protocol = cdn.ssl ? 'https' : 'http';
  const cdnUrl = `${protocol}://localhost:${cdn.port}`;

  return elgarOverride({
    redirectUrl: `https://www.wix.com/dashboard/${metaSiteId}/${route}`,
    staticOverrides: getStaticOverrides(cdnUrl),
    bmOverride: mergeConfigs(model, cdnUrl, prodConfig),
  });
};

export interface BMOverrides {
  modules: Record<string, Partial<AppConfigTemplate>>;
}

const elgarOverride = ({
  redirectUrl,
  staticOverrides,
  bmOverride,
}: {
  redirectUrl: string;
  staticOverrides: Record<string, string>;
  bmOverride: AppConfig;
}) => {
  const bmOverrides: BMOverrides = {
    modules: {
      [bmOverride.moduleId!]: bmOverride,
    },
  };

  return (
    'https://apps.wix.com/elgar-server/redirect' +
    `?redirectToUrl=${redirectUrl}` +
    // BM overrides need to enable `specs.wos2.AllowOverrideConfigsInBM`
    `&experiments=${encodeURIComponent(
      'specs.wos2.AllowOverrideConfigsInBM#true',
    )}` +
    `&staticsVersions=${JSON.stringify(staticOverrides)}` +
    `&bmOverrides=${JSON.stringify(bmOverrides)}`
  );
};

export default getStartUrl;

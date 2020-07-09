import { EditorReadyFn as PlatformEditorReadyFn } from '@wix/platform-editor-sdk';
import {
  SentryConfig,
  ExperimentsConfig,
  TranslationsConfig,
  DefaultTranslations,
} from './constants';
import { EditorReadyFn } from './types';
import { EditorScriptFlowAPI } from './flow-api/EditorScript';

interface EditorReadyOptions {
  editorReady: EditorReadyFn;
  sentry: SentryConfig | null;
  artifactId: string;
  experimentsConfig: ExperimentsConfig | null;
  translationsConfig: TranslationsConfig | null;
  defaultTranslations: DefaultTranslations | null;
}

export const editorReadyWrapper = ({
  editorReady,
  sentry,
  experimentsConfig,
  artifactId,
  translationsConfig,
  defaultTranslations,
}: EditorReadyOptions): PlatformEditorReadyFn => async (
  editorSDK,
  appDefinitionId,
  platformOptions,
) => {
  const language = await editorSDK.environment.getLocale();

  const flowAPI = new EditorScriptFlowAPI({
    experimentsConfig,
    sentry,
    language,
    platformOptions,
    artifactId,
    translationsConfig,
    defaultTranslations,
  });
  let editorReadyResult;

  try {
    await flowAPI.translations.init();
    editorReadyResult = await editorReady(
      editorSDK,
      appDefinitionId,
      platformOptions,
      flowAPI,
    );

    flowAPI.fedopsLogger.appLoaded();
  } catch (error) {
    flowAPI.reportError(error);
    throw error;
  }

  return editorReadyResult;
};

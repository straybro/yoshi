import { EditorReadyFn as PlatformEditorReadyFn } from '@wix/platform-editor-sdk';
import {
  IInitAppForPage,
  IWidgetControllerConfig,
  IWidgetController,
  IWidgetConfig,
  IPlatformServices,
} from '@wix/native-components-infra/dist/src/types/types';
import { ExperimentsBag } from '@wix/wix-experiments';
import { BaseLogger } from '@wix/fedops-logger';
import {
  ViewerScriptFlowAPI,
  ControllerFlowAPI,
} from './flow-api/ViewerScript';
import { EditorScriptFlowAPI } from './flow-api/EditorScript';
import { VisitorLogger } from './generated/bi-logger-types';

export type ReportError = (error: Error | ErrorEvent | string) => void;

export interface ControllerParams {
  appData?: IControllerAppData;
  widgetConfig?: IWidgetConfig;
  controllerConfig: IWidgetControllerConfig;
  flowAPI: ControllerFlowAPI;
}

type EditorReadyParams = Parameters<PlatformEditorReadyFn>;

export type EditorReadyFn = (
  editorSDK: EditorReadyParams[0],
  appDefinitionId: EditorReadyParams[1],
  platformOptions: EditorReadyParams[2],
  flowAPI: EditorScriptFlowAPI,
) => Promise<void> | void;

type IInitAppForPageParams = Parameters<IInitAppForPage>;

export type InitAppForPageFn = (
  initParams: IInitAppForPageParams[0],
  apis: IInitAppForPageParams[1],
  namespaces: IInitAppForPageParams[2],
  platformServices: IInitAppForPageParams[3],
  flowAPI: ViewerScriptFlowAPI,
) => Promise<any>;

export type EditorScriptFedopsLoggerFactoryFn = (
  loggerName: string,
) => ReturnType<typeof Object>;

export type CreateControllerFn = (
  controllerContext: ControllerParams,
) => Promise<IWidgetController> | IWidgetController;

export type IControllerAppData = {
  [key: string]: any;
  __prepopulated?: IPrepopulatedData;
};
export interface IPrepopulatedData {
  experiments?: ExperimentsBag;
  translations?: Record<string, string>;
  sentryMonitor?: ReturnType<IPlatformServices['monitoring']['createMonitor']>;
  fedopsLogger?: BaseLogger<string>;
  biLogger?: VisitorLogger;
}

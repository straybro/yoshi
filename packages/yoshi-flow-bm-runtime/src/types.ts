import { ModuleId } from '@wix/business-manager-api';
import { IBMModuleParams } from './moduleParams';

export interface ModuleInitOptions {
  module: any;
  moduleParams: IBMModuleParams;
}

export type ModuleInitFn = (this: any, options: ModuleInitOptions) => void;

export type ModuleConfigOptions = ModuleInitOptions;

export type ModuleConfigFn = (
  this: any,
  options: ModuleConfigOptions,
  sourceModuleId: ModuleId,
  configPayload: any,
) => void;

export interface MethodOptions {
  module: any;
  moduleParams: IBMModuleParams;
}

export type MethodFn = (
  this: any,
  options: MethodOptions,
  ...args: Array<any>
) => any;

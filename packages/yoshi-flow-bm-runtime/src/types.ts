import { ModuleId } from '@wix/business-manager-api';
import { IBMModuleParams } from './moduleParams';

export interface ModuleOptions {
  module: any;
  moduleParams: IBMModuleParams;
}

export type ModuleInitFn = (this: any, options: ModuleOptions) => void;

export type ModuleConfigFn = (
  this: any,
  options: ModuleOptions,
  sourceModuleId: ModuleId,
  configPayload: any,
) => void;

export type MethodFn = (
  this: any,
  options: ModuleOptions,
  ...args: Array<any>
) => any;

export type FilesFn = (this: any, options: ModuleOptions) => Array<string>;

export type ResolveFn<P extends {}> = (
  this: any,
  options: ModuleOptions,
) => Promise<P> | P;

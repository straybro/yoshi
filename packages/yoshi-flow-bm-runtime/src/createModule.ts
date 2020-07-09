import {
  BusinessManagerModule,
  ModuleId,
  PageComponentId,
  registerModule,
  registerPageComponentMonitors,
} from '@wix/business-manager-api';
import { ModuleRegistry, ReactLoadableComponent } from 'react-module-container';
import { ComponentType } from 'react';
import { BrowserClient } from '@sentry/browser';
import { IBMModuleParams } from './hooks/ModuleProvider';
import { MethodFn, ModuleConfigFn, ModuleInitFn } from './types';

interface ModuleOptions {
  moduleId: string;
  moduleConfigurationId?: string;
  pages: Array<{
    componentId: string;
    componentName: string;
    loadComponent(): Promise<ComponentType<any>>;
  }>;
  exportedComponents: Array<{
    componentId: string;
    loadComponent(): Promise<ComponentType<any>>;
  }>;
  methods: Array<{
    methodId: string;
    loadMethod(): MethodFn;
  }>;
  moduleInit?: ModuleInitFn;
  moduleConfig?: ModuleConfigFn;
  sentryDsn?: string;
}

export default function createModule({
  moduleId,
  moduleConfigurationId,
  pages,
  exportedComponents,
  methods,
  moduleInit,
  moduleConfig,
  sentryDsn,
}: ModuleOptions) {
  const sentryClient = sentryDsn
    ? new BrowserClient({
        dsn: sentryDsn,
      })
    : undefined;

  class Module extends BusinessManagerModule {
    state: any = {};
    moduleParams!: IBMModuleParams;

    setState = (newState: any) => (this.state = newState);

    constructor(moduleId: ModuleId) {
      super(moduleId);
      if (moduleConfigurationId) {
        this.setModuleConfigurationId(moduleConfigurationId as ModuleId);
      }

      pages.forEach(({ componentId, componentName, loadComponent }) => {
        if (sentryClient) {
          registerPageComponentMonitors(componentId as PageComponentId, {
            sentryClient,
          });
        }

        this.registerPageComponent(
          componentName,
          ReactLoadableComponent(componentName, loadComponent),
        );
      });

      exportedComponents.forEach(({ componentId, loadComponent }) => {
        this.registerComponentWithModuleParams(
          componentId,
          ReactLoadableComponent(componentId, loadComponent),
        );
      });

      methods
        .map(({ methodId, loadMethod }) => ({
          methodId,
          method: loadMethod(),
        }))
        .forEach(({ methodId, method }) => {
          ModuleRegistry.registerMethod(methodId, () =>
            method.bind(this, {
              module: this,
              moduleParams: this.moduleParams,
            }),
          );
        });
    }

    init(moduleParams: IBMModuleParams) {
      this.moduleParams = moduleParams;
      if (moduleInit) {
        moduleInit.call(this, { module: this, moduleParams });
      }
    }

    config(sourceModule: ModuleId, configPayload: any) {
      if (moduleConfig) {
        moduleConfig.call(
          this,
          { module: this, moduleParams: this.moduleParams },
          sourceModule,
          configPayload,
        );
      }
    }
  }

  registerModule(moduleId as ModuleId, Module);
}

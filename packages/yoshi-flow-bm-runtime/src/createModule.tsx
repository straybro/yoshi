import {
  BusinessManagerModule,
  ModuleId,
  PageComponentId,
  registerModule,
  registerPageComponentMonitors,
} from '@wix/business-manager-api';
import { ModuleRegistry, ReactLoadableComponent } from 'react-module-container';
import React, { ComponentType, useMemo } from 'react';
import { BrowserClient } from '@sentry/browser';
import { IBMModuleParams } from './hooks/ModuleProvider';
import {
  FilesFn,
  MethodFn,
  ModuleConfigFn,
  ModuleInitFn,
  ResolveFn,
} from './types';

interface ModuleHooks {
  files?: FilesFn;
  resolve?: ResolveFn<any>;
}

interface ModuleOptions {
  moduleId: string;
  moduleConfigurationId?: string;
  pages: Array<{
    componentId: string;
    componentName: string;
    moduleHooks: ModuleHooks;
    loadComponent(): Promise<ComponentType<any>>;
  }>;
  exportedComponents: Array<{
    componentId: string;
    moduleHooks: ModuleHooks;
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

      pages.forEach(
        ({ componentId, componentName, loadComponent, moduleHooks }) => {
          if (sentryClient) {
            registerPageComponentMonitors(componentId as PageComponentId, {
              sentryClient,
            });
          }

          this.registerPageComponent(
            componentName,
            this.createLazyComponent(componentId, loadComponent, moduleHooks),
          );
        },
      );

      exportedComponents.forEach(
        ({ componentId, loadComponent, moduleHooks }) => {
          this.registerComponentWithModuleParams(
            componentId,
            this.createLazyComponent(componentId, loadComponent, moduleHooks),
          );
        },
      );

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

    private createLazyComponent(
      id: string,
      loadComponent: () => Promise<ComponentType<any>>,
      { files, resolve }: ModuleHooks,
    ): ComponentType<IBMModuleParams> {
      // A thin "synchronous" component is created
      // to grab `moduleParams` from props and create
      // the true lazy wrapper once we can call
      // `files(moduleParams)`.
      return (props) => {
        const Component = useMemo(
          () =>
            ReactLoadableComponent(
              id,
              resolve
                ? () =>
                    Promise.all([
                      loadComponent(),
                      resolve.call(this, { module: this, moduleParams: props }),
                    ]).then(([component, resolved = {}]) => ({
                      default: component,
                      ...resolved,
                    }))
                : loadComponent,
              files?.call(this, { module: this, moduleParams: props }),
            ),
          [],
        );

        return <Component {...props} />;
      };
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

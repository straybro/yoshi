import React, { ComponentType, lazy, useEffect } from 'react';
import { ModuleRegistry } from 'react-module-container';
import { LazyComponentLoadingError } from 'react-module-container/dist/src/ReactModuleContainerErrors';
import { IBMModuleParams } from './moduleParams';
import { filesAppender, unloadStyles } from './tag-appender';

export interface CreateLazyComponentProps {
  name: string;
  loadComponent: () => Promise<ComponentType<IBMModuleParams>>;
  files?: Array<string>;
  resolve?: Promise<{}>;
  crossorigin?: boolean;
  unloadStylesOnDestroy?: boolean;
}

export function createLazyComponent({
  name,
  files = [],
  loadComponent,
  crossorigin,
  resolve,
  unloadStylesOnDestroy,
}: CreateLazyComponentProps) {
  return lazy(async () => {
    ModuleRegistry.notifyListeners(
      'reactModuleContainer.componentStartLoading',
      name,
    );

    try {
      const filesAppenderPromise = filesAppender(files, crossorigin);

      const [ComponentType, resolvedData] = await Promise.all([
        loadComponent(),
        resolve,
        filesAppenderPromise,
      ]);

      ModuleRegistry.notifyListeners(
        'reactModuleContainer.componentReady',
        name,
      );

      return {
        default: (props: IBMModuleParams) => {
          useEffect(
            () => () => {
              if (unloadStylesOnDestroy !== false) {
                unloadStyles(document, files);
              }
            },
            [],
          );
          return <ComponentType {...props} {...resolvedData} />;
        },
      };
    } catch (err) {
      ModuleRegistry.notifyListeners(
        'reactModuleContainer.error',
        new LazyComponentLoadingError(name, err),
      );
      throw err;
    }
  });
}

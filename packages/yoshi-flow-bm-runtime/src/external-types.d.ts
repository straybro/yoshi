declare module 'react-module-container' {
  import React from 'react';

  export const ReactLoadableComponent: <P = {}>(
    name: string,
    resolve: () => Promise<{ default: React.ComponentType<P> }>,
    files?: Array<string>,
  ) => React.ComponentType<P>;

  export const ModuleRegistry: {
    registerMethod: <T extends (...args: Array<any>) => any>(
      id: string,
      method: T,
    ) => unknown;
    notifyListeners: (eventName: string, ...args: Array<any>) => unknown;
    addListener: (
      eventName: string,
      callback: (...args: Array<any>) => unknown,
    ) => void;
  };
}

declare module 'react-module-container/dist/src/tag-appender';

declare module 'react-module-container/dist/src/ReactModuleContainerErrors';

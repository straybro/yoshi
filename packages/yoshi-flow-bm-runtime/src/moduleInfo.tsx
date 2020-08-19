import React, { FC } from 'react';
import ModuleInfoProvider, { ModuleInfo } from './hooks/ModuleInfoProvider';

export { ModuleInfo } from './hooks/ModuleInfoProvider';

export function createModuleInfoProvider(moduleInfo: ModuleInfo) {
  const Provider: FC = ({ children }) => {
    return (
      <ModuleInfoProvider moduleInfo={moduleInfo}>
        {children}
      </ModuleInfoProvider>
    );
  };

  return Provider;
}

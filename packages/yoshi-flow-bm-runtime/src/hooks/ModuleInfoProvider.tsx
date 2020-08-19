import React, { createContext, FC } from 'react';

export interface ModuleInfo {
  appDefId: string;
}

export const ModuleContext = createContext<ModuleInfo>(undefined as any);

export interface ModuleInfoProviderProps {
  moduleInfo: ModuleInfo;
}

const ModuleInfoProvider: FC<ModuleInfoProviderProps> = ({
  moduleInfo,
  children,
}) => {
  return (
    <ModuleContext.Provider value={moduleInfo}>
      {children}
    </ModuleContext.Provider>
  );
};

export default ModuleInfoProvider;

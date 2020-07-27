import React, { createContext, FC, useMemo } from 'react';
import { notifyViewStartLoading } from '@wix/business-manager-api';

export interface ComponentInfo {
  componentId: string;
  type: 'page' | 'exported-component';
}

export const ComponentContext = createContext<ComponentInfo>(undefined as any);

export interface ComponentInfoProviderProps {
  componentInfo: ComponentInfo;
}

const ComponentInfoProvider: FC<ComponentInfoProviderProps> = ({
  componentInfo,
  children,
}) => {
  useMemo(() => {
    if (componentInfo.type === 'page') {
      notifyViewStartLoading(componentInfo.componentId);
    }
  }, []);

  return (
    <ComponentContext.Provider value={componentInfo}>
      {children}
    </ComponentContext.Provider>
  );
};

export default ComponentInfoProvider;

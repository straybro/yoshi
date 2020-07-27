import React, { FC } from 'react';
import ComponentInfoProvider, {
  ComponentInfo,
} from './hooks/ComponentInfoProvider';

export { ComponentInfo } from './hooks/ComponentInfoProvider';

export function createComponentInfoProvider(componentInfo: ComponentInfo) {
  const Provider: FC = ({ children }) => {
    return (
      <ComponentInfoProvider componentInfo={componentInfo}>
        {children}
      </ComponentInfoProvider>
    );
  };

  return Provider;
}

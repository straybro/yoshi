import React, { createContext, FC, useState } from 'react';
import { create, FedopsLogger } from '@wix/fedops-logger';

export const FedopsContext = createContext<FedopsLogger | null>(null);

export interface FedopsProviderProps {
  appName: string;
}

const FedopsProvider: FC<FedopsProviderProps> = ({ appName, children }) => {
  const [client] = useState(() => create(appName));

  return (
    <FedopsContext.Provider value={client}>{children}</FedopsContext.Provider>
  );
};

export default FedopsProvider;

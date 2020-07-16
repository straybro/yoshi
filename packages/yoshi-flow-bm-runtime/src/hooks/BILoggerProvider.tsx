import React, { createContext, FC } from 'react';
import { BILogger } from '../bi';

export const BILoggerContext = createContext<BILogger | null>(null);

export interface BILoggerProviderProps {
  logger: BILogger;
}

const BILoggerProvider: FC<BILoggerProviderProps> = ({ logger, children }) => (
  <BILoggerContext.Provider value={logger}>{children}</BILoggerContext.Provider>
);

export default BILoggerProvider;

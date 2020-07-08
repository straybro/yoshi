import React, { createContext, FC } from 'react';
import { BrowserClient } from '@sentry/browser';
import ErrorBoundary from '../ErrorBoundary';

export const SentryContext = createContext<BrowserClient | null>(null);

export interface SentryProviderProps {
  client: BrowserClient;
}

const SentryProvider: FC<SentryProviderProps> = ({ client, children }) => {
  return (
    <SentryContext.Provider value={client}>
      <ErrorBoundary>{children}</ErrorBoundary>
    </SentryContext.Provider>
  );
};

export default SentryProvider;

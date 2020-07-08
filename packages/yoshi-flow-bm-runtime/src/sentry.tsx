import React, { FC } from 'react';
import { BrowserClient } from '@sentry/browser';
import SentryProvider from './hooks/SentryProvider';

export { default as useSentry } from './hooks/useSentry';
export { default as withSentry, InjectedSentryProps } from './hooks/withSentry';

export function createSentryProvider(dsn: string) {
  const client = new BrowserClient({
    dsn,
  });

  const Provider: FC = ({ children }) => (
    <SentryProvider client={client}>{children}</SentryProvider>
  );

  return Provider;
}

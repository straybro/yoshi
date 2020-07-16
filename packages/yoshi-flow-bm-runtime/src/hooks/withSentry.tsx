import React, { ComponentType, FC } from 'react';
import { BrowserClient } from '@sentry/browser';
import useSentry from './useSentry';

export interface InjectedSentryProps {
  sentryClient: BrowserClient;
}

const withSentry = <P extends InjectedSentryProps>(
  Component: ComponentType<P>,
) => {
  const Wrapped: FC<Omit<P, keyof InjectedSentryProps>> = (props) => {
    const sentryClient = useSentry();

    return <Component {...({ ...props, sentryClient } as P)} />;
  };

  return Wrapped;
};

export default withSentry;

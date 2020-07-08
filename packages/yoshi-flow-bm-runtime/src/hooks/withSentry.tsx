import React, { ComponentType, FC, useContext } from 'react';
import { BrowserClient } from '@sentry/browser';
import { SentryContext } from './SentryProvider';

export interface InjectedSentryProps {
  sentryClient: BrowserClient;
}

const withSentry = <P extends InjectedSentryProps>(
  Component: ComponentType<P>,
) => {
  const Wrapped: FC<Omit<P, keyof InjectedSentryProps>> = (props) => {
    const sentryClient = useContext(SentryContext)!;

    return <Component {...({ ...props, sentryClient } as P)} />;
  };

  return Wrapped;
};

export default withSentry;

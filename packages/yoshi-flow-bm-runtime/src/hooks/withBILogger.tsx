import React, { ComponentType, FC } from 'react';
import { BILogger } from '../bi';
import useBILogger from './useBILogger';

export interface InjectedBILoggerProps {
  biLogger: BILogger;
}

const withBILogger = <P extends InjectedBILoggerProps>(
  Component: ComponentType<P>,
) => {
  const Wrapped: FC<Omit<P, keyof InjectedBILoggerProps>> = (props) => {
    const biLogger = useBILogger();

    return <Component {...({ ...props, biLogger } as P)} />;
  };

  return Wrapped;
};

export default withBILogger;

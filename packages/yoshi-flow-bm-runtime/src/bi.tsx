import React, { FC } from 'react';
import webBiLogger from '@wix/web-bi-logger';
import BILoggerProvider from './hooks/BILoggerProvider';

export { default as useBILogger } from './hooks/useBILogger';
export {
  default as withBILogger,
  InjectedBILoggerProps,
} from './hooks/withBILogger';
// eslint-disable-next-line import/no-extraneous-dependencies
export { Logger as BILogger } from 'yoshi-flow-bm/generated/biLogger.d';

export function createBIProvider(
  initSchemaLogger: (logger: any) => (options: any) => any,
) {
  const logger = initSchemaLogger(webBiLogger)({});

  const Provider: FC = ({ children }) => (
    <BILoggerProvider logger={logger}>{children}</BILoggerProvider>
  );

  return Provider;
}

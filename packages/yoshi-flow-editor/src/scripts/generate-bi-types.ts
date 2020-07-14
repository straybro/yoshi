#!/usr/bin/env node

import importCwd from 'import-cwd';
import { AppConfig } from '../model';
import { overrideBILoggerTypes } from '../wrappers/biLoggerTypes';
import { normalizeBIConfig } from '../utils';

export default () => {
  const appConfig = importCwd.silent('.application.json') as AppConfig;

  const normalizedConfig = normalizeBIConfig(appConfig?.bi);
  if (normalizedConfig) {
    overrideBILoggerTypes(normalizedConfig);
  }
};

import { useEffect, useState } from 'react';
import {
  appDefIds,
  getCurrentInstance,
  registerToInstanceChanges,
} from '@wix/business-manager-api';
import useModuleInfo from './useModuleInfo';

export const useInstance = (maybeAppDefId?: string) => {
  const { appDefId: configAppDefId } = useModuleInfo();

  const appDefId = maybeAppDefId ?? configAppDefId ?? appDefIds.metaSite;

  const [instance, setInstance] = useState(() => getCurrentInstance(appDefId));

  useEffect(() => {
    const { remove } = registerToInstanceChanges(appDefId, setInstance);

    return remove;
  }, [appDefId, setInstance]);

  return instance;
};

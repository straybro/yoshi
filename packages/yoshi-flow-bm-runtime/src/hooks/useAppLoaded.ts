import { useCallback, useEffect } from 'react';
import { notifyViewFinishedLoading } from '@wix/business-manager-api';
import { useFedops } from '../fedops';
import useComponentInfo from './useComponentInfo';

export interface AppLoadedOptions {
  auto?: boolean;
}

const useAppLoaded = ({ auto }: AppLoadedOptions = {}) => {
  const { componentId } = useComponentInfo();
  const fedops = useFedops();

  const callback = useCallback(() => {
    notifyViewFinishedLoading(componentId);
    if (fedops) {
      fedops.appLoaded();
    }
  }, [componentId, fedops]);

  useEffect(() => {
    if (auto) {
      callback();
    }
  }, [callback]);

  return callback;
};

export default useAppLoaded;

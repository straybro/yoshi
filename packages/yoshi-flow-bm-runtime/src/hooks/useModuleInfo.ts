import { useContext } from 'react';
import { ModuleContext } from './ModuleInfoProvider';

const useModuleInfo = () => useContext(ModuleContext)!;

export default useModuleInfo;

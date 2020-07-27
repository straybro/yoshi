import { useContext } from 'react';
import { ComponentContext } from './ComponentInfoProvider';

const useComponentInfo = () => useContext(ComponentContext)!;

export default useComponentInfo;

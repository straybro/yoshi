import t from './template';

type Opts = Record<'controllerFileName' | 'controllerWrapperPath', string>;

export default t<Opts>`
  import userController from '${({ controllerFileName }) =>
    controllerFileName}';
  import createControllerWrapper from '${({ controllerWrapperPath }) =>
    controllerWrapperPath}';

  export default createControllerWrapper(userController);
`;

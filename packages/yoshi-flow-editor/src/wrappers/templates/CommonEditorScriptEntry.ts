import t from './template';

type Opts = Record<'editorEntryFileName', string>;

export default t<Opts>`
  export * from '${({ editorEntryFileName }) => editorEntryFileName}';
`;

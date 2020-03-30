import commonEditorScriptEntry from '../CommonEditorScriptEntry';

describe('CommonEditorScriptEntry template', () => {
  it('generates correct template with entry editorScript file', () => {
    const generateEditorScriptEntryContent = commonEditorScriptEntry({
      editorEntryFileName: 'project/src/editor.app.ts',
    });

    expect(generateEditorScriptEntryContent).toMatchSnapshot();
  });
});

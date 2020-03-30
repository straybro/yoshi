import path from 'path';
import fs from 'fs-extra';
import { FlowEditorModel } from '../model';
import editorScriptEntry from './templates/CommonEditorScriptEntry';

const editorScriptWrapper = (
  generatedWidgetEntriesPath: string,
  model: FlowEditorModel,
) => {
  if (!model.editorEntryFileName) {
    return {};
  }

  const generatedEditorScriptEntryPath = path.join(
    generatedWidgetEntriesPath,
    'editorScript.js',
  );

  const generateEditorScriptEntryContent = editorScriptEntry({
    editorEntryFileName: model.editorEntryFileName,
  });

  fs.outputFileSync(
    generatedEditorScriptEntryPath,
    generateEditorScriptEntryContent,
  );

  return {
    editorScript: generatedEditorScriptEntryPath,
  };
};

export default editorScriptWrapper;

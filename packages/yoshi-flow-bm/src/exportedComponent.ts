import path from 'path';
import fs from 'fs-extra';
import { ExportedComponentModel, FlowBMModel } from './model';
import { EXPORTED_COMPONENTS_DIR, GENERATED_DIR } from './constants';
import { renderLegacyExportedComponent } from './legacyExportedComponent';
import { generateComponentCode } from './component';

export const getExportedComponentEntryPath = ({
  relativePath,
}: ExportedComponentModel) =>
  path.join(GENERATED_DIR, EXPORTED_COMPONENTS_DIR, relativePath);

export const renderExportedComponent = (
  component: ExportedComponentModel,
  model: FlowBMModel,
) => {
  const componentEntry = getExportedComponentEntryPath(component);
  fs.outputFileSync(
    componentEntry,
    generateComponentCode(component, 'exported-component', model),
  );
  if (component.config.legacyBundle) {
    renderLegacyExportedComponent(component);
  }
};

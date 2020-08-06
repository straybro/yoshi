import path from 'path';
import fs from 'fs-extra';
import resolveCwd from 'resolve-cwd';
import { STATICS_DIR } from 'yoshi-config/build/paths';

export default (viewerScriptPath: string) => {
  const externalViewerScriptPath = resolveCwd(viewerScriptPath);
  const destination = path.join(
    process.cwd(),
    STATICS_DIR,
    'viewerScript.bundle.js',
  );

  fs.copyFileSync(externalViewerScriptPath, destination);
};

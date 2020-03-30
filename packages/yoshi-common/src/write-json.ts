import os from 'os';
import fs from 'fs-extra';

export default function writeJson(
  fileName: string,
  object: Record<string, any>,
) {
  fs.outputFileSync(
    fileName,
    JSON.stringify(object, null, 2).replace(/\n/g, os.EOL) + os.EOL,
  );
}

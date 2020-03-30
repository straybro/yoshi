import path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as babel from '@babel/core';
import globby from 'globby';
import fs from 'fs-extra';
import * as chokidar from 'chokidar';
import { SRC_DIR, CJS_DIR } from 'yoshi-config/build/paths';
import copyFilesSync from './copy-files';

const stripExtension = (filePath: string) => {
  return filePath.replace(path.extname(filePath), '');
};

function transpileFile({ filePath, cwd }: { filePath: string; cwd: string }) {
  const abosoluteFilePath = path.join(cwd, SRC_DIR, filePath);

  const filePathInBuildDir = path.join(cwd, CJS_DIR, filePath);

  const content = fs.readFileSync(abosoluteFilePath, 'utf-8');

  const relativeSourceFileName = path.relative(
    path.dirname(filePathInBuildDir),
    abosoluteFilePath,
  );

  const transpiledContent = babel.transform(content, {
    filename: filePathInBuildDir,
    sourceFileName: relativeSourceFileName,
    sourceMaps: true,
    plugins: ['@babel/plugin-transform-typescript'],
    presets: [['babel-preset-yoshi', { mode: 'test' }]],
  });

  const filePathInBuildDirNoExtensions = stripExtension(filePathInBuildDir);
  const mapFilePath = `${filePathInBuildDirNoExtensions}.js.map`;

  fs.outputFileSync(mapFilePath, JSON.stringify(transpiledContent?.map));

  const sourceMappingURLComment = `\n//# sourceMappingURL=${path.basename(
    mapFilePath,
  )}`;

  fs.outputFileSync(
    `${filePathInBuildDirNoExtensions}.js`,
    transpiledContent?.code + sourceMappingURLComment,
  );
}

export default ({
  watch = false,
  copyFiles = true,
  cwd,
}: {
  watch?: boolean;
  copyFiles?: boolean;
  cwd: string;
}) => {
  const tsFilesGlobPattern = ['**/*.js', '**/*.ts', '**/*.tsx', '**/*.json'];
  const absoluteRootDir = path.join(cwd, SRC_DIR);

  const tsFiles = globby.sync(tsFilesGlobPattern, {
    cwd: absoluteRootDir,
  });

  const _transpileFile = (filePath: string) => transpileFile({ filePath, cwd });

  tsFiles.forEach(_transpileFile);

  const gracefullTranspileFile = (filePath: string) => {
    try {
      _transpileFile(filePath);
    } catch (error) {
      // We don't want to throw in case there is a babel parsing error
      // This happens during watch mode
      // Throwing an error and exiting the watch mode is not good
      console.error(error);
    }
  };

  if (copyFiles) {
    copyFilesSync({ watch, outDir: CJS_DIR, rootDir: SRC_DIR, cwd });
  }

  if (watch) {
    const watcher = chokidar.watch(tsFilesGlobPattern, {
      cwd: absoluteRootDir,
      ignoreInitial: true,
    });

    watcher
      .on('add', gracefullTranspileFile)
      .on('change', gracefullTranspileFile);
  }
};

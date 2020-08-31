import path from 'path';
import traverse from '@babel/traverse';
import { v4 as uuidv4 } from 'uuid';
import { SRC_DIR } from 'yoshi-config/build/paths';
import { parse } from '@babel/parser';

function collectExportNames(source: string) {
  const exportedNames: Array<string> = [];
  const ast = parse(source, { sourceType: 'module', plugins: ['typescript'] });

  traverse(ast, {
    ExportNamedDeclaration({ node }) {
      if (node.declaration) {
        if (node.declaration.type === 'VariableDeclaration') {
          const [declaration] = node.declaration.declarations;

          if (declaration.id.type === 'Identifier') {
            exportedNames.push(declaration.id.name);
          }
        }
      }
    },
  });

  return exportedNames;
}

export function transform(source: string, fullFileName: string) {
  const srcDir = path.resolve(SRC_DIR);
  const fileName = path.relative(srcDir, fullFileName).replace(/\.[^/.]+$/, '');

  const yoshiServerString = process.env.EXPERIMENTAL_YOSHI_SERVERLESS
    ? 'yoshi-serverless/build/wrap'
    : 'yoshi-server/build/wrap';

  const headers = [`import { dsl } from '${yoshiServerString}';`];

  const functions = collectExportNames(source as string).map((functionName) => {
    return `export const ${functionName} = dsl({
          functionName: '${functionName}',
          fileName: '${fileName}',
        });`;
  });

  return [...headers, ...functions].join('\n\n');
}

export function generateServerlessBuildId() {
  process.env.SERVERLESS_BUILD_UNIQUE_ID = uuidv4();
}

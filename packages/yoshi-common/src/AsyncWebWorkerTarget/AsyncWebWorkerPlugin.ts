// @ts-nocheck
import WebWorkerHotUpdateChunkTemplatePlugin from 'webpack/lib/webworker/WebWorkerHotUpdateChunkTemplatePlugin';
import WebWorkerChunkTemplatePlugin from './WebWorkerChunkTemplatePlugin';
import { WebWorkerMainTemplatePlugin } from './WebWorkerMainTemplatePlugin';

export class AsyncWebWorkerPlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap(
      'AsyncWebWorkerTemplatePlugin',
      (compilation) => {
        new WebWorkerMainTemplatePlugin().apply(compilation.mainTemplate);
        new WebWorkerChunkTemplatePlugin().apply(compilation.chunkTemplate);
        new WebWorkerHotUpdateChunkTemplatePlugin().apply(
          compilation.hotUpdateChunkTemplate,
        );
      },
    );
  }
}

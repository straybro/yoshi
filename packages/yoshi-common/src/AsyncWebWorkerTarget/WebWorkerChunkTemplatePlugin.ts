// @ts-nocheck
const { ConcatSource } = require('webpack-sources');

class WebWorkerChunkTemplatePlugin {
  apply(chunkTemplate) {
    chunkTemplate.hooks.render.tap(
      'WebWorkerChunkTemplatePlugin',
      (modules, chunk) => {
        const source = new ConcatSource();
        source.add(`[${JSON.stringify(chunk.ids)},`);
        source.add(modules);
        source.add(']');
        return source;
      },
    );
    chunkTemplate.hooks.hash.tap('WebWorkerChunkTemplatePlugin', (hash) => {
      hash.update('webworker');
      hash.update('3');
      hash.update(`${chunkTemplate.outputOptions.chunkCallbackName}`);
      hash.update(`${chunkTemplate.outputOptions.globalObject}`);
    });
  }
}
module.exports = WebWorkerChunkTemplatePlugin;

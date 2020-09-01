// @ts-nocheck
const { ConcatSource } = require('webpack-sources');

class WebWorkerChunkTemplatePlugin {
  apply(chunkTemplate) {
    chunkTemplate.hooks.render.tap(
      'WebWorkerChunkTemplatePlugin',
      (modules, chunk) => {
        const source = new ConcatSource();
        // use an assignment so terser doesn't clean this entire file
        // will be used by the main chunk as `Function('return ' + ...)`
        // which returns the value of the assignment
        source.add(`self._tmp_ = [${JSON.stringify(chunk.ids)},`);
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

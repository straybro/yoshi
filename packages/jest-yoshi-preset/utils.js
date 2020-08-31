const project = require('yoshi-config');
const transform = require('yoshi-server-tools/build/jest-transform');

function withServerTransformer(transformer) {
  return {
    ...transformer,
    process(source, filename, config, transformOptions) {
      let result = source;
      const isYoshiServer =
        project.yoshiServer || process.env.EXPERIMENTAL_YOSHI_SERVERLESS;
      if (isYoshiServer && /\.api\.(js|tsx?)$/.test(filename)) {
        result = transform.process(source, filename);
      }

      return transformer.process(result, filename, config, transformOptions);
    },
  };
}

module.exports = {
  withServerTransformer,
};

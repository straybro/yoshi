module.exports = {
  // react-custom-scroll 3.x has untrinspiled entry. wix-base-ui is using it and can't bump the version since it contain some breacking changes.
  // With this change we are trying to provide an out-of-the-box fix for everyone.
  externalUnprocessedModules: ['react-custom-scroll'],
  servers: {
    cdn: {
      ssl: true,
    },
  },
};

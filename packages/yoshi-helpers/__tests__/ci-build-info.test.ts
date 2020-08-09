import { getBuildInfoForPackage } from '../src/ci-build-info';

const tp = require('../../../test-helpers/test-phases');
const fx = require('../../../test-helpers/fixtures');

describe('ci-build-info', () => {
  const test = tp.create();

  describe('getBuildInfoForPackage', () => {
    it('should return the package info', () => {
      const res = test.setup({ 'package.json': fx.packageJson() });
      Object.assign(process.env, res.ciBuildInfoEnv);

      const packageInfo = getBuildInfoForPackage('a');
      expect(packageInfo).toBeDefined();
    });

    it('should throw on missing package', () => {
      const res = test.setup({ 'package.json': fx.packageJson() });
      Object.assign(process.env, res.ciBuildInfoEnv);

      expect(() => getBuildInfoForPackage('b')).toThrow(
        `Missing build info for package 'b', known packages: a`,
      );
    });
  });
});

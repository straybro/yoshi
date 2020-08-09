import { getBuildInfo, PackageInfo } from '@wix/ci-build-info';

export function getBuildInfoForPackage(packageName: string): PackageInfo {
  const packages = getBuildInfo().v1.packages;
  const packageInfo = packages[packageName];
  if (!packageInfo) {
    const knownPackages = Object.keys(packages).join(', ');
    throw new Error(
      `Missing build info for package '${packageName}', known packages: ${knownPackages}`,
    );
  }

  return packageInfo;
}

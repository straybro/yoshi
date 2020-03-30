// eslint-disable-next-line import/no-extraneous-dependencies
import { Entry, EntryFunc, ExternalsElement } from 'webpack';
import { PackageJson } from 'read-pkg';

type WebpackEntry = string | Array<string> | Entry | EntryFunc;

type WebpackExternals = ExternalsElement | Array<ExternalsElement>;

// Webpack types doesn't expose this
type Library = string | Array<string> | { [key: string]: string };

export type InitialBundleConfig = {
  library?: Library;
  entry?: WebpackEntry;
  externals?: WebpackExternals;
  port?: number;
  https?: boolean;
};

export type InitialConfig = {
  bundle: InitialBundleConfig | boolean;
  storybook?: boolean;
};

export type BundleConfig = RequiredRecursively<
  Partial<InitialBundleConfig> & { url: string }
>;

export type Config = {
  pkgJson: PackageJson;
  jestConfig: unknown;
  bundleConfig: BundleConfig | null;
  storybook: boolean;
};

export type RequiredRecursively<T> = Exclude<
  T extends string | number | boolean | Function | RegExp
    ? T
    : {
        [P in keyof T]-?: T[P] extends Array<infer U>
          ? Array<RequiredRecursively<U>>
          : T[P] extends Array<infer U>
          ? Array<RequiredRecursively<U>>
          : RequiredRecursively<T[P]>;
      },
  null | undefined
>;

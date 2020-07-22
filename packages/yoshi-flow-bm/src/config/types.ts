export type InitialModuleConfig = Partial<ModuleConfig>;

export interface SentryConfig {
  DSN: string;
  id?: string;
  teamName?: string;
  projectName?: string;
}

export interface TranslationConfig {
  default: string;
  suspense?: boolean;
}

export interface ModuleConfig {
  moduleId: string;
  moduleConfigurationId?: string;
  appDefId?: string;
  translations?: TranslationConfig;
  experimentsScopes: Array<string>;
  sentry?: SentryConfig;
  bi?: string;
  routeNamespace: string;
  topology: Record<string, { artifactId: string }>;
  moduleBundleName: string;
}

export type InitialExportedComponentConfig = Partial<ExportedComponentConfig>;

export interface ExportedComponentConfig {
  componentId: string;
  legacyBundle?: {
    bundleName: string;
    lazyComponentId: string;
  };
}

export type InitialPageConfig = Partial<PageConfig>;

export interface PageConfig extends ExportedComponentConfig {
  componentName: string;
}

export type InitialMethodConfig = Partial<MethodConfig>;

export interface MethodConfig {
  methodId: string;
}

import React, { ComponentType, useMemo, Suspense } from 'react';
import ModuleProvider, { IBMModuleParams } from './hooks/ModuleProvider';

interface AdditionalProps {
  routeBaseName?: string;
  router?: any;
}

export default function wrapComponent<P extends {}>(
  Component: ComponentType<P>,
  deps: Array<ComponentType>,
): ComponentType<IBMModuleParams & AdditionalProps & P> {
  return (props) => {
    const {
      routeBaseName,
      router,
      metaSiteId,
      children,
      config,
      accountLanguage,
      brand,
      coBranding,
      debug,
      instance,
      instanceId,
      liveSite,
      locale,
      primarySiteLocale,
      siteName,
      userId,
      userPermissions,
      userRole,
      viewMode,
      ...restProps
    } = props;

    const moduleParams: IBMModuleParams & AdditionalProps = useMemo(
      () => ({
        routeBaseName,
        router,
        metaSiteId,
        config,
        accountLanguage,
        brand,
        coBranding,
        debug,
        instance,
        instanceId,
        liveSite,
        locale,
        primarySiteLocale,
        siteName,
        userId,
        userPermissions,
        userRole,
        viewMode,
      }),
      [
        routeBaseName,
        router,
        metaSiteId,
        config,
        accountLanguage,
        brand,
        coBranding,
        debug,
        instance,
        instanceId,
        liveSite,
        locale,
        primarySiteLocale,
        siteName,
        userId,
        userPermissions,
        userRole,
        viewMode,
      ],
    );

    return (
      <Suspense fallback="SUSPENDEDDDDDDD">
        <ModuleProvider moduleParams={moduleParams}>
          {deps.reduce(
            (children, Provider) => (
              <Provider>{children}</Provider>
            ),
            <Component {...((restProps as unknown) as P)}>
              {children}
            </Component>,
          )}
        </ModuleProvider>
      </Suspense>
    );
  };
}

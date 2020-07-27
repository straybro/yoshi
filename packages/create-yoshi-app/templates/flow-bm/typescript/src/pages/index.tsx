import React, { FC, Suspense } from 'react';
import {
  useExperiments,
  useTranslation,
  useAppLoaded,
} from 'yoshi-flow-bm-runtime';
import s from './index.scss';

const Experiment: FC = () => {
  const { experiments } = useExperiments();

  return (
    <div>
      Spec is {experiments.enabled('specs.foo.bar') ? 'ENABLED' : 'DISABLED'}!
    </div>
  );
};

const Index: FC = () => {
  useAppLoaded({ auto: true });

  const [t] = useTranslation();

  return (
    <div className={s.root}>
      <div className={s.header}>
        <h1 data-hook="app-title">{t('app.title')}</h1>
      </div>
      <p className={s.intro}>
        {t('app.intro', {
          introUrl:
            'https://github.com/wix-private/business-manager-test-app/blob/master/docs/step-by-step.md',
        })}
      </p>
      <Suspense fallback="Conducting...">
        <Experiment />
      </Suspense>
    </div>
  );
};

export default Index;

import Experiments from '@wix/wix-experiments';
import { ExperimentsConfig } from '../constants';
import { ReportError, IPrepopulatedData } from '../types';
import {
  initExperimentsGetter,
  initLoadedExperimentsGetter,
} from '../fetchExperiments';

export class FlowAPI {
  getExperiments: () => Promise<Experiments>;

  constructor({
    experimentsConfig,
    prepopulatedData,
  }: {
    experimentsConfig: ExperimentsConfig | null;
    prepopulatedData?: IPrepopulatedData;
  }) {
    const prepopulatedExperiments = prepopulatedData?.experiments;

    if (prepopulatedExperiments || !experimentsConfig) {
      this.getExperiments = initLoadedExperimentsGetter(
        prepopulatedExperiments,
      );
    } else {
      this.getExperiments = initExperimentsGetter(experimentsConfig);
    }
  }

  reportError: ReportError = (error) => {
    console.warn(
      "You are trying to report an error, but didn't configure sentry in `.application.json`\n\nPlease read the docs for more information https://wix.github.io/yoshi/docs/editor-flow/structure-api/app-configuration/#applicationjson",
      'Error: ',
      error,
    );
  };
}

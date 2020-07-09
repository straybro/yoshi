import Experiments from '@wix/wix-experiments';
import { ExperimentsConfig } from '../constants';
import { ReportError } from '../types';
import {
  initExperimentsGetter,
  initEmptyExperimentsGetter,
} from '../fetchExperiments';

export class FlowAPI {
  getExperiments: () => Promise<Experiments>;

  constructor({
    experimentsConfig,
  }: {
    experimentsConfig: ExperimentsConfig | null;
  }) {
    if (experimentsConfig) {
      this.getExperiments = initExperimentsGetter(experimentsConfig);
    } else {
      this.getExperiments = initEmptyExperimentsGetter();
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

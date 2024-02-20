import { SSTConfig } from 'sst';
import { RemixStack } from './stacks/RemixStack';
import { REGION } from './shared/constants';

export default {
  config(_input) {
    return {
      name: 'hackednews',
      region: REGION,
    };
  },
  stacks(app) {
    app.stack(RemixStack);
  },
} satisfies SSTConfig;

import { SSTConfig } from 'sst';
import { RemixStack } from './stacks/RemixStack';

export default {
  config(_input) {
    return {
      name: 'hackednews',
      region: 'us-west-2',
    };
  },
  stacks(app) {
    app.stack(RemixStack);
  },
} satisfies SSTConfig;

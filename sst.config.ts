import { SSTConfig } from 'sst';
import { BackendStack } from './stacks/BackendStack';
import { RemixStack } from './stacks/RemixStack';

export default {
  config(_input) {
    return {
      name: 'hackednews',
      region: process.env.AWS_REGION || 'us-east-1',
    };
  },
  stacks(app) {
    app.stack(BackendStack);
    app.stack(RemixStack);
  },
} satisfies SSTConfig;

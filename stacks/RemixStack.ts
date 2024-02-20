import { RemixSite, StackContext, use } from 'sst/constructs';
import { BackendStack } from './BackendStack';

export function RemixStack({ stack }: StackContext) {
  const { table } = use(BackendStack);

  // Create the Remix site
  const site = new RemixSite(stack, 'Site', { bind: [table] });

  // Add the site's URL to stack output
  stack.addOutputs({
    URL: site.url || 'localhost',
  });
}

import { RemixSite, StackContext } from 'sst/constructs';

export function RemixStack({ stack }: StackContext) {
  // Create the Remix site
  const site = new RemixSite(stack, 'Site');

  // Add the site's URL to stack output
  stack.addOutputs({
    URL: site.url || 'localhost',
  });
}

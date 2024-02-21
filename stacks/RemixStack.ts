import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { RemixSite, StackContext, use } from 'sst/constructs';
import { BackendStack } from './BackendStack';

export function RemixStack({ stack }: StackContext) {
  const { table } = use(BackendStack);

  // Create the Remix site
  const site = new RemixSite(stack, 'Site', {
    bind: [table],
    customDomain: {
      domainName: 'hn.binhrobles.com',
      isExternalDomain: true,
      cdk: {
        certificate: Certificate.fromCertificateArn(
          stack,
          'HNCert',
          'arn:aws:acm:us-east-1:152014527758:certificate/9300e347-ad37-4f68-aef8-f8c1024f7abb'
        ),
      },
    },
  });

  // Add the site's URL to stack output
  stack.addOutputs({
    URL: site.url || 'localhost',
  });
}

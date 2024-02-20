import { STORY_TABLE_NAME } from '../shared/constants';
import { Cron, Table, RemixSite, StackContext } from 'sst/constructs';

export function RemixStack({ stack }: StackContext) {
  const table = new Table(stack, STORY_TABLE_NAME, {
    fields: {
      id: 'number',
      by: 'string',
      comments: 'number',
      score: 'number',
      time: 'number',
      title: 'string',
      type: 'string',
      url: 'string',
    },
    primaryIndex: { partitionKey: 'id' },
    globalIndexes: {
      TopStoriesByTimeIndex: {
        partitionKey: 'type', // just use story
        sortKey: 'time',
      },
    },
  });

  const liveDataFetch = new Cron(stack, 'LiveDataFetch', {
    schedule: 'rate(2 minutes)',
    job: 'packages/functions/liveDataFetch.handler',
  });
  liveDataFetch.bind([table]);

  // Create the Remix site
  const site = new RemixSite(stack, 'Site', { bind: [table] });

  // Add the site's URL to stack output
  stack.addOutputs({
    URL: site.url || 'localhost',
  });
}

import { Cron, Function, Table, StackContext } from 'sst/constructs';

export function BackendStack({ stack }: StackContext) {
  const table = new Table(stack, 'HackedNewsContent', {
    fields: {
      id: 'number',
      score: 'number',
      time: 'number',
      type: 'string',
      isEngaged: 'string',
      'year-month': 'string',
    },
    primaryIndex: { partitionKey: 'id' },
    globalIndexes: {
      // isEngaged is set to 'y' on stories that have reached
      // a score of ENGAGEMENT_THRESHOLD, reducing the amount of data
      // that needs to be scanned on "past week" or "past month" queries
      EngagedStoriesByTimeIndex: {
        partitionKey: 'isEngaged',
        sortKey: 'time',
      },
      // used to fetch stories from the last x hours
      StoriesByTimeIndex: {
        partitionKey: 'type',
        sortKey: 'time',
      },
      // used to fetch top stories from a specific month
      TopStoriesByMonthIndex: {
        partitionKey: 'year-month',
        sortKey: 'score',
      },
    },
  });

  const liveDataFetch = new Cron(stack, 'LiveDataFetch', {
    schedule: 'rate(1 hour)',
    job: 'packages/functions/liveDataFetch.handler',
  });
  liveDataFetch.bind([table]);

  const historicalDataFetch = new Function(
    stack,
    'HistoricalDataFetch',
    {
      handler: 'packages/functions/historicalDataFetch.handler',
      timeout: 300,
    }
  );
  historicalDataFetch.bind([table]);

  return { table };
}

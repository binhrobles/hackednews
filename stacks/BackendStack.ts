import { Cron, Function, Table, StackContext } from 'sst/constructs';

export function BackendStack({ stack }: StackContext) {
  const table = new Table(stack, 'HackedNewsContent', {
    fields: {
      id: 'number',
      score: 'number',
      time: 'number',
      type: 'string',
      'year-month': 'string',
    },
    primaryIndex: { partitionKey: 'id' },
    globalIndexes: {
      StoriesByTimeIndex: {
        partitionKey: 'type', // just use story
        sortKey: 'time',
      },
      TopStoriesByMonthIndex: {
        partitionKey: 'year-month',
        sortKey: 'score',
      },
    },
  });

  const liveDataFetch = new Cron(stack, 'LiveDataFetch', {
    schedule: 'rate(30 minutes)',
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

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
      EngagedStoriesByTimeIndex: {
        partitionKey: 'isEngaged',
        sortKey: 'time',
      },
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

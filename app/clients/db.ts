import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  QueryCommand,
  QueryCommandInput,
  QueryCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import { Table } from 'sst/node/table';

import { RenderableStory, Story } from 'shared/types';
import { getTimeDiffString, isYearMonth } from 'shared/utils';
import {
  DAY_S,
  WEEK_S,
  STORIES_PER_PAGE,
  Range,
} from 'shared/consts';

// Create a DynamoDB client
const ddbClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
});
const client = DynamoDBDocumentClient.from(ddbClient);

const queryCommandFromRange = (
  range: string,
  start: string
): QueryCommand => {
  let queryCommandInput: QueryCommandInput = {
    TableName: Table.HackedNewsContent.tableName,
  };

  // populate Query command input based on the range
  if (range === Range.WEEK) {
    // fetch all stories from the last week
    // will need to cull down to page limit
    const now = Math.floor(Date.now() / 1000);
    const lastWeek = now - WEEK_S;
    queryCommandInput = {
      ...queryCommandInput,
      IndexName: 'EngagedStoriesByTimeIndex',
      KeyConditionExpression:
        'isEngaged = :isEngaged AND #time > :time',
      ExpressionAttributeValues: {
        ':isEngaged': 'y',
        ':time': lastWeek,
      },
      ExpressionAttributeNames: {
        '#time': 'time',
      },
    };
  } else if (range === Range.MONTH && isYearMonth(start)) {
    // fetch top stories from the specified month
    queryCommandInput = {
      ...queryCommandInput,
      IndexName: 'TopStoriesByMonthIndex',
      KeyConditionExpression: '#ym = :month',
      ExpressionAttributeValues: {
        ':month': start,
      },
      ExpressionAttributeNames: {
        '#ym': 'year-month',
      },
      ScanIndexForward: false,
      Limit: STORIES_PER_PAGE,
    };
  } else {
    // implicitly range === Range.TODAY
    // fetch stories from last 24 hours
    const now = Math.floor(Date.now() / 1000);
    const yesterday = now - DAY_S;
    queryCommandInput = {
      ...queryCommandInput,
      IndexName: 'StoriesByTimeIndex',
      KeyConditionExpression: '#type = :type AND #time > :time',
      ExpressionAttributeValues: {
        ':type': 'story',
        ':time': yesterday,
      },
      ExpressionAttributeNames: {
        '#type': 'type',
        '#time': 'time',
      },
      Limit: STORIES_PER_PAGE,
    };
  }

  return new QueryCommand(queryCommandInput);
};

export const fetchStoriesFromRange = async (
  range: string,
  start: string
) => {
  const queryCommand = queryCommandFromRange(range, start);
  const { Items }: QueryCommandOutput = await client.send(
    queryCommand
  );

  // package them up and return them
  const stories = Items as Story[];
  const renderableStories: RenderableStory[] = stories.map(
    (story) => {
      return {
        ...story,
        timeDiff: getTimeDiffString(story.time),
      };
    }
  );

  return renderableStories;
};

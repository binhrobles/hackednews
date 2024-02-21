import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  QueryCommand,
  QueryCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import { Table } from 'sst/node/table';

import { RenderableStory, Story } from 'shared/types';
import { getTimeDiffString } from 'shared/utils';

const STORIES_PER_PAGE = 50;

// Create a DynamoDB client
const ddbClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
});
const client = DynamoDBDocumentClient.from(ddbClient);

// fetch stories from last 24 hours
export const fetchRecentStories = async () => {
  const now = Math.floor(Date.now() / 1000);
  const yesterday = now - 24 * 60 * 60;

  const { Items }: QueryCommandOutput = await client.send(
    new QueryCommand({
      TableName: Table.HackedNewsContent.tableName,
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
    })
  );

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

// fetch top stories from the specified month
export const fetchStoriesByMonth = async (month: string) => {
  const { Items }: QueryCommandOutput = await client.send(
    new QueryCommand({
      TableName: Table.HackedNewsContent.tableName,
      IndexName: 'TopStoriesByMonthIndex',
      KeyConditionExpression: '#ym = :month',
      ExpressionAttributeValues: {
        ':month': month,
      },
      ExpressionAttributeNames: {
        '#ym': 'year-month',
      },
      Limit: STORIES_PER_PAGE,
      ScanIndexForward: false,
    })
  );

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

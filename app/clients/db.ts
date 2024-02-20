import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  QueryCommand,
  QueryCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import { Table } from 'sst/node/table';

import { RenderableStory, Story } from 'shared/types';
import { getTimeDiffString } from 'shared/utils';

// Create a DynamoDB client
const ddbClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
});
const client = DynamoDBDocumentClient.from(ddbClient);

export const fetchRecentStories = async () => {
  // fetch all stories from last 24 hours
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

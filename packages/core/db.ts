// file centralizing interface with Story Table
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  BatchWriteCommand,
} from '@aws-sdk/lib-dynamodb';

import { STORY_TABLE_NAME, REGION } from 'shared/constants';
import { Story } from 'shared/types';
import { chunker } from 'shared/utils';

// Create a DynamoDB client
const ddbClient = new DynamoDBClient({ region: REGION });
const client = DynamoDBDocumentClient.from(ddbClient);

export const putStories = async (stories: Story[]) => {
  // ddb batchWrite only allows 25 items per request
  const storyChunks = chunker(stories);

  for (const chunk of storyChunks) {
    await client.send(
      new BatchWriteCommand({
        RequestItems: {
          [STORY_TABLE_NAME]: chunk.map((story) => ({
            PutRequest: {
              Item: story,
            },
          })),
        },
      })
    );
  }
};

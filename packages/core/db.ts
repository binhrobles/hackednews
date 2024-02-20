// file centralizing interface with Story Table
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  BatchWriteCommand,
} from '@aws-sdk/lib-dynamodb';

import { STORY_TABLE_NAME, REGION } from '../../shared/constants';
import { Story } from '../../shared/types';

// Create a DynamoDB client
const ddbClient = new DynamoDBClient({ region: REGION });
const client = DynamoDBDocumentClient.from(ddbClient);

// generator yielding every chunkSize elements
function* chunker(arr: any[], chunkSize: number = 25) {
  for (let i = 0; i < arr.length; i += chunkSize) {
    yield arr.slice(i, i + chunkSize);
  }
}

export const putStories = async (stories: Story[]) => {
  try {
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
  } catch (err) {
    console.error(err);
  }
};

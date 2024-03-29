import {
  fetchTopStories,
  HNStoryResponse,
} from 'packages/core/hackernews';
import { putStories } from 'packages/core/db';
import { Story } from 'shared/types';
import { dateToYearMonth } from 'shared/utils';
import { ENGAGEMENT_THRESHOLD } from 'shared/consts';

const formatStories = (stories: HNStoryResponse[]): Story[] => {
  return stories.map((story) => ({
    id: story.id,
    type: story.type,
    time: story.time,
    comments: story.descendants,
    score: story.score,
    title: story.title,
    url: story.url,
    by: story.by,
    'year-month': dateToYearMonth(new Date(story.time * 1000)),
    isEngaged: story.score > ENGAGEMENT_THRESHOLD ? 'y' : undefined,
  }));
};

// fetches top stories from hacker news and puts them in the database
export async function handler() {
  const storyResponses: HNStoryResponse[] = await fetchTopStories();
  console.log(`Received ${storyResponses.length} stories from HN`);

  const stories = formatStories(storyResponses);
  await putStories(stories);

  console.log(`Stored ${stories.length} stories in the database`);
}

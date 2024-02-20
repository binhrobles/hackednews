import { chunker } from 'shared/utils';

const HN_BASE_URL = 'https://hacker-news.firebaseio.com/v0';

export type StoryIdsResponse = number[];
export type HNStoryResponse = {
  by: string;
  descendants: number;
  id: number;
  kids: number[];
  score: number;
  time: number;
  title: string;
  type: string;
  url: string;
};

// fetches top stories from hacker news
export const fetchStories = async () => {
  const storiesRes = await fetch(`${HN_BASE_URL}/topstories.json`);
  const storyIds: StoryIdsResponse = await storiesRes.json();

  // only fetch 10 stories at a time
  const storyIdChunks = chunker(storyIds, 10);

  const stories: HNStoryResponse[] = [];
  for (const chunk of storyIdChunks) {
    const promises = chunk.map(async (storyId: number) => {
      const storyRes = await fetch(
        `${HN_BASE_URL}/item/${storyId}.json`
      );
      const story: HNStoryResponse = await storyRes.json();
      return story;
    });
    stories.push(...(await Promise.all(promises)));
  }
  return stories;
};

import { chunker, dateToYYYYMMDD } from 'shared/utils';

const HN_BASE_URL = 'https://hacker-news.firebaseio.com/v0';
const HCKR_BASE_URL = 'https://hckrnews.com/data';

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
export type HCKRStoryResponse = {
  submitter: string;
  date: number; // 1708300715,
  comments?: number | null; // 13
  type: string;
  link_text: string; // "Open Source Games",
  time: string; // "1708298421",
  link: string;
  points?: number; // 45;
  id: string; // '39424566';
};

// fetches top stories from hacker news
export const fetchTopStories = async () => {
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

// fetch story from date from hckr API
// https://hckrnews.com/data/20240218.js
export const fetchStoriesFromDate = async (
  date: Date
): Promise<HCKRStoryResponse[]> => {
  const res = await fetch(
    `${HCKR_BASE_URL}/${dateToYYYYMMDD(date)}.js`
  );
  return (await res.json()) as HCKRStoryResponse[];
};

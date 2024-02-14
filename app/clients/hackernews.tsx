import { Story, StoryIdsResponse } from '~/types';

const STORIES_PER_PAGE = 30;
const hackerNewsBaseUrl = 'https://hacker-news.firebaseio.com/v0';

const viewToHackerNewsPath: Record<string, string> = {
  ask: 'askstories',
  home: 'topstories',
  new: 'newstories',
  show: 'showstories',
  jobs: 'jobstories',
};

const fetchStories = async ({
  view,
  page = 1,
}: {
  view: string;
  page?: number;
}) => {
  const path = viewToHackerNewsPath[view];

  if (!path || typeof page !== 'number' || page < 1) {
    throw Error('Invalid args provided to fetchStories');
  }

  const storiesRes = await fetch(`${hackerNewsBaseUrl}/${path}.json`);
  const storyIds: StoryIdsResponse = await storiesRes.json();

  const start = (page - 1) * STORIES_PER_PAGE;
  const end = page * STORIES_PER_PAGE;

  const promises = storyIds
    .slice(start, end)
    .map(async (storyId: number) => {
      const storyRes = await fetch(
        `${hackerNewsBaseUrl}/item/${storyId}.json`
      );
      const story: Story = await storyRes.json();
      return story;
    });

  return await Promise.all(promises);
};

export default {
  fetchStories,
};

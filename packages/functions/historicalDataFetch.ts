import { Story } from 'shared/types';
import { dateToYearMonth } from 'shared/utils';
import {
  HCKRStoryResponse,
  fetchStoriesFromDate,
} from '../core/hackernews';
import { putStories } from '../core/db';

type HistoricalDataFetchEvent = {
  startDate: string;
  endDate: string;
};

const HCKRStoryToStory = (
  story: HCKRStoryResponse,
  yearMonth: string
): Story => {
  return {
    id: parseInt(story.id),
    type: story.type,
    time: parseInt(story.time),
    comments: story.comments || 0,
    score: story.points || 0,
    title: story.link_text,
    url: story.link,
    by: story.submitter,
    'year-month': yearMonth,
  };
};

// fetches historical data from hckrnews API and puts them in the database
export const handler = async (event: HistoricalDataFetchEvent) => {
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  const stories: Story[] = [];
  for (
    let date = startDate;
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    const yearMonth = dateToYearMonth(date);

    const storiesForDate: HCKRStoryResponse[] =
      await fetchStoriesFromDate(date);
    stories.push(
      ...storiesForDate.map((story) =>
        HCKRStoryToStory(story, yearMonth)
      )
    );
  }
  console.log(`Received ${stories.length} stories from HN`);

  await putStories(stories);
  console.log(`Stored ${stories.length} stories in the database`);
};

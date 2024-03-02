import { Story } from 'shared/types';
import { dateToUnix, dateToYearMonth } from 'shared/utils';
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
  yearMonth: string,
  timeFallback: number
): Story => {
  return {
    id: Number(story.id),
    type: story.type,
    time: story.date || timeFallback,
    comments: story.comments || 0,
    score: Number(story.points) || 0,
    title: story.link_text,
    url: story.link,
    by: story.submitter,
    'year-month': yearMonth,
    isEngaged:
      Number(story.points) > 100 || Number(story.comments) > 100
        ? 'y'
        : undefined,
  };
};

// fetches historical data from hckrnews API and puts them in the database
export const handler = async (event: HistoricalDataFetchEvent) => {
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  for (
    let date = startDate;
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    let storiesForDate: HCKRStoryResponse[] = [];
    try {
      console.log(`fetching stories for ${date.toDateString()}`);
      const yearMonth = dateToYearMonth(date);
      const timeFallback = dateToUnix(date);

      storiesForDate = await fetchStoriesFromDate(date);
      const stories = storiesForDate
        // remove stories with uuid and non-existent ids
        .filter((story) => story.id && !isNaN(Number(story.id)))
        .map((story) =>
          HCKRStoryToStory(story, yearMonth, timeFallback)
        );
      await putStories(stories);
      console.log(`Stored ${stories.length} stories in the database`);
    } catch (e) {
      console.error(JSON.stringify(storiesForDate, null, 2));
      throw e;
    }
  }
};

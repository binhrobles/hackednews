// app/_index.tsx acts as the default route for the app
// In our case, this will render a list of the top 10 stories from Hacker News

import { useLoaderData } from '@remix-run/react';
import { Story, StoryIdsResponse } from '~/types';
import StoryList from '~/components/StoryList';

export const loader = async () => {
  const bestRes = await fetch(
    'https://hacker-news.firebaseio.com/v0/beststories.json'
  );
  const storyIds: StoryIdsResponse = await bestRes.json();

  const promises = storyIds
    .slice(0, 10)
    .map(async (storyId: number) => {
      const storyRes = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${storyId}.json`
      );
      const story: Story = await storyRes.json();
      return story;
    });

  const stories = await Promise.all(promises);

  return { stories };
};

export default function Index() {
  const { stories } = useLoaderData<typeof loader>();
  return (
    <>
      {/* 
        Technically, the '/' route.
        The route should dictate which stories are loaded,
        and thus which stories are passed to the StoryLineItems component.
      */}
      <section id="content" className="container mx-auto px-2">
        <StoryList stories={stories} />
      </section>
    </>
  );
}

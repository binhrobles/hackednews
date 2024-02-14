// app/_index.tsx acts as the default route for the app
// In our case, this will render a list of the top 10 stories from Hacker News

import { useLoaderData } from '@remix-run/react';
import { LoaderFunctionArgs, json } from '@remix-run/node';
import { Story, StoryIdsResponse } from '~/types';
import StoryList from '~/components/StoryList';

const hackerNewsBaseUrl = 'https://hacker-news.firebaseio.com/v0';

const viewToHackerNewsPath: Record<string, string> = {
  ask: 'askstories',
  home: 'beststories',
  new: 'newstories',
  show: 'showstories',
  jobs: 'jobstories',
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // parse the search params for `?view=`
  const url = new URL(request.url);
  const view = url.searchParams.get('view') || 'home';
  const path = viewToHackerNewsPath[view];

  if (!path) {
    throw json('Page Not Found', { status: 404 });
  }

  const storiesRes = await fetch(
    `${hackerNewsBaseUrl}/${viewToHackerNewsPath[view]}.json`
  );
  const storyIds: StoryIdsResponse = await storiesRes.json();

  const promises = storyIds
    .slice(0, 10)
    .map(async (storyId: number) => {
      const storyRes = await fetch(
        `${hackerNewsBaseUrl}/item/${storyId}.json`
      );
      const story: Story = await storyRes.json();
      return story;
    });

  const stories = await Promise.all(promises);

  return json({ stories });
};

export default function Index() {
  const { stories } = useLoaderData<typeof loader>();

  return (
    <>
      <section id="content" className="container mx-auto px-2">
        <StoryList stories={stories} />
      </section>
    </>
  );
}

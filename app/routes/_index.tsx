// app/_index.tsx acts as the default route for the app
// In our case, this will render a list of the top 10 stories from Hacker News

import { useLoaderData } from '@remix-run/react';
import { LoaderFunctionArgs, json } from '@remix-run/node';
import StoryList from '~/components/StoryList';
import HNClient from '~/clients/hackernews';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // parse the search params for `?view=`
  const url = new URL(request.url);
  const view = url.searchParams.get('view') || 'home';
  const page = Number(url.searchParams.get('page')) || 1;

  try {
    const stories = await HNClient.fetchStories({ view, page });
    return json({ stories });
  } catch (e) {
    console.error(e);
    throw json('Page Not Found', { status: 404 });
  }
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

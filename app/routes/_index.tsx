// app/_index.tsx acts as the default route for the app
// In our case, this will render a list of the top 10 stories from Hacker News

import { useLoaderData, Link } from '@remix-run/react';
import { LoaderFunctionArgs, json } from '@remix-run/node';
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

const getTimeDiff = (time: number) => {
  const timeDiff = new Date().getTime() - time * 1000;

  let value: number;
  let unit: string;
  switch (true) {
    case timeDiff < 1000 * 60 * 60:
      value = Math.floor(timeDiff / (1000 * 60));
      unit = 'minute';
      break;
    case timeDiff < 1000 * 60 * 60 * 24:
      value = Math.floor(timeDiff / (1000 * 60 * 60));
      unit = 'hour';
      break;
    default:
      value = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      unit = 'day';
      break;
  }
  if (value > 1) unit += 's';

  return `${value} ${unit} ago`;
};

export default function Index() {
  const { stories } = useLoaderData<typeof loader>();

  return (
    <section className="container mx-auto px-4">
      <table className="table">
        <tbody>
          {stories.map((story) => {
            const timeDiff = getTimeDiff(story.time);

            return (
              <tr>
                <th>{story.score}</th>
                <td>
                  <Link to={story.url} className="text-lg">
                    {story.title}
                  </Link>{' '}
                  {story.url
                    ? `(${new URL(story.url).hostname})`
                    : ''}
                  <div>
                    submitted {timeDiff} by {story.by}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

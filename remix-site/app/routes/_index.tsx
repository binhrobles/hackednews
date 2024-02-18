// app/_index.tsx acts as the default route for the app
// In our case, this will render a list of the top 10 stories from Hacker News

import {
  useLoaderData,
  Link,
  useSearchParams,
} from '@remix-run/react';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;

  const setPage = (targetPage: number) => {
    setSearchParams((prev) => {
      prev.set('page', String(targetPage));
      return prev;
    });
  };

  return (
    <section className="container mx-auto px-4">
      <ul>
        {stories.map((story) => {
          const timeDiff = getTimeDiff(story.time);

          return (
            <div
              key={story.id}
              className="py-2 flex flex-col border-secondary border-solid border-b-2 last:border-b-0"
            >
              <span>
                <Link className="text-base" to={story.url}>
                  {story.title}
                </Link>{' '}
                {story.url ? `(${new URL(story.url).hostname})` : ''}
              </span>
              <div className="text-xs flex space-x-2">
                <span className="flex text-accent">
                  <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.6 13.7A2 2 0 0 0 7 17h10a2 2 0 0 0 1.5-3.3l-4.9-5.9a2 2 0 0 0-3 0l-5 6Z"
                      clipRule="evenodd"
                    />
                  </svg>

                  {story.score}
                </span>

                <span>
                  submitted {timeDiff} by {story.by}
                </span>
              </div>
            </div>
          );
        })}
      </ul>

      <div>
        {page > 1 && (
          <button
            className="btn btn-sm btn-ghost text-accent"
            onClick={() => setPage(page - 1)}
          >
            prev
          </button>
        )}
        {page < 10 && (
          <button
            className="btn btn-sm btn-ghost text-accent"
            onClick={() => setPage(page + 1)}
          >
            next
          </button>
        )}
      </div>
    </section>
  );
}

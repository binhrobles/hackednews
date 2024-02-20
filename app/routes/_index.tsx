import {
  useLoaderData,
  Link,
  useSearchParams,
} from '@remix-run/react';
import { LoaderFunctionArgs, json } from '@remix-run/node';
import { fetchRecentStories } from '~/clients/db';
import { getTimeDiffString } from '~/utils';
import { Story } from 'shared/types';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    // fetch stories from desired period
    const stories = await fetchRecentStories();
    return json({ stories });
  } catch (e) {
    console.error(e);
    throw json('Page Not Found', { status: 404 });
  }
};

const scoreSort = (a: Story, b: Story) => b.score - a.score;

export default function Index() {
  const { stories } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;

  const scoreSortedStories = stories.sort(scoreSort);

  const setPage = (targetPage: number) => {
    setSearchParams((prev) => {
      prev.set('page', String(targetPage));
      return prev;
    });
  };

  return (
    <section className="container mx-auto md:px-4">
      <ul>
        {scoreSortedStories.map((story) => {
          const timeDiff = getTimeDiffString(story.time);

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

                <span>submitted {timeDiff}</span>
                <span>|</span>
                <a
                  href={`https://news.ycombinator.com/item?id=${story.id}`}
                >
                  {story.comments} comments
                </a>
              </div>
            </div>
          );
        })}
      </ul>

      <div className="flex space-x-2">
        {page > 1 && (
          <button
            className="btn btn-sm btn-outline btn-secondary"
            onClick={() => setPage(page - 1)}
          >
            prev
          </button>
        )}
        {page < 10 && (
          <button
            className="btn btn-sm btn-outline btn-secondary"
            onClick={() => setPage(page + 1)}
          >
            next
          </button>
        )}
      </div>
    </section>
  );
}

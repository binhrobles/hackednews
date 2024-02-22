import { useLoaderData, Link } from '@remix-run/react';
import { LoaderFunctionArgs, json } from '@remix-run/node';
import {
  fetchRecentStories,
  fetchStoriesByMonth,
} from '~/clients/db';
import { RenderableStory } from 'shared/types';

const scoreSort = (a: RenderableStory, b: RenderableStory) =>
  b.score - a.score;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const month = url.searchParams.get('month');

  try {
    const stories =
      month && month.length > 0
        ? await fetchStoriesByMonth(month)
        : await fetchRecentStories();
    return json({ stories });
  } catch (e) {
    console.error(e);
    throw json('Page Not Found', { status: 404 });
  }
};

export default function Index() {
  const { stories } = useLoaderData<typeof loader>();

  const scoreSortedStories = stories.sort(scoreSort);

  return (
    <section className="container mx-auto md:px-4">
      {scoreSortedStories.map((story) => (
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

            <span>submitted {story.timeDiff}</span>
            <span>|</span>
            <a
              href={`https://news.ycombinator.com/item?id=${story.id}`}
            >
              {story.comments} comments
            </a>
          </div>
        </div>
      ))}
    </section>
  );
}

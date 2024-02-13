import type { MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

type BestStoryIdsRes = number[];
type Story = {
  by: string;
  descendants: number;
  id: number;
  kids: number[];
  score: number;
  time: number;
  title: string;
  type: string;
  url: string;
}

export const meta: MetaFunction = () => {
  return [
    { title: "Hacked News" },
    { name: "description", content: "Another Hacker News Remix" },
  ];
};

export const loader = async () => {
  const bestRes = await fetch('https://hacker-news.firebaseio.com/v0/beststories.json');
  const storyIds: BestStoryIdsRes = await bestRes.json();
  
  const promises = storyIds.slice(0, 10).map(async (storyId: number) => {
    const storyRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${storyId}.json`);
    const story: Story = await storyRes.json();
    return story;
  });

  const stories = await Promise.all(promises);

  return { stories };
};

const StoryLineItems = ({ stories }: { stories: Story[] }) => (
  stories.map(story => {
    const postTime = new Date(story.time * 1000);
    return (
      <li key={story.id}>
        <a>{story.score}</a>
        <Link to={story.url}>
          {story.title}
        </Link>
        <a> 
          by {story.by} {`${postTime.toLocaleDateString()} ${postTime.toLocaleTimeString()}`}
        </a>
      </li>
    );
  })
)

const NavBarLineItems = () => (
  ['new', 'past', 'ask', 'show'].map(link => (
      <li key={link}>
        <a href={link}>{link}</a>
      </li>
    ))
)

export default function Index() {
  const { stories } = useLoaderData<typeof loader>();
  return (
    <main className="container mx-auto px-2">
      <div className="navbar">
        <div className="navbar-start">
          <a href='/' className="btn btn-ghost text-xl">Hacked News</a>
        </div>

        <div className="navbar-end">
          {/* standard navbar menu */}
          <ul className="menu hidden sm:menu-horizontal bg-base-100">
            <NavBarLineItems />
          </ul>

          {/* mobile navbar menu */}
          <details className="dropdown dropdown-end sm:hidden">
            <summary className="btn btn-ghost rounded-btn">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
              </svg>
            </summary>
            <ul className="dropdown-content menu bg-base-100 rounded-box shadow">
              <NavBarLineItems />
            </ul>
          </details>

        </div>
      </div>

      {/* 
        Technically, the '/' route.
        The route should dictate which stories are loaded,
        and thus which stories are passed to the StoryLineItems component.
      */}
      <section className="container mx-auto px-2">
        <ul>
          <StoryLineItems 
            stories={stories}
          />
        </ul>
      </section>
    </main>
  );
}

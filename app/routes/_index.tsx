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

const RowItem = ({ story }: { story: Story }) => {
  const postTime = new Date(story.time * 1000);

  return (
    <>
      <a>{story.score}</a>
      <Link to={story.url}>
        {story.title}
      </Link>
      <a> 
        by {story.by} {`${postTime.toLocaleDateString()} ${postTime.toLocaleTimeString()}`}
      </a>
    </>
  )
}

export default function Index() {
  const { stories } = useLoaderData<typeof loader>();
  return (
    <main className="container mx-auto px-2">
      <nav>
        <h3 className="font-bold underline">Hacked News</h3>
        <Link to="/">home</Link>
        <Link to="/new">new</Link>
        <Link to="/past">past</Link>
        <Link to="/comments">comments</Link>
      </nav>
      <section className="container mx-auto px-2">
        <ul>
          {stories.map(story => (
              <li key={story.id}>
                <RowItem 
                  story={story}
                />
              </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

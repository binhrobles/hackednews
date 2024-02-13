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

export default function Index() {
  const { stories } = useLoaderData<typeof loader>();
  return (
    <>
      {/* 
        Technically, the '/' route.
        The route should dictate which stories are loaded,
        and thus which stories are passed to the StoryLineItems component.
      */}
      <section id='content' className="container mx-auto px-2">
        <ul>
          <StoryLineItems 
            stories={stories}
          />
        </ul>
      </section>
    </>
  );
}

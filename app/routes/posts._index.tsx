import React from "react";

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

export default function Posts() {
  const { stories } = useLoaderData<typeof loader>();
  return (
    <main>
      <h1 className="text-3xl font-bold underline">Hacked News</h1>
      <ul>
        {stories.map(story => (
            <li key={story.id}>
                <Link
                    to={story.url}>
                    {story.title}
                </Link>
            </li>
        ))}
      </ul>
    </main>
  );
}

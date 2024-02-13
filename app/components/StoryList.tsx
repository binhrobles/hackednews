import { Link } from "@remix-run/react";
import { Story } from "~/types";

export default function StoryList({ stories }: { stories: Story[] }) {
  return (
    <ul>
      {stories.map(story => {
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
      })}
    </ul>
  )
}
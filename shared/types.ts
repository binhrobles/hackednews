export type Story = {
  id: number; // PK
  type: string; // GSI PK
  time: number; // unix timestamp, SK
  comments: number;
  score: number;
  title: string;
  url: string;
  by: string;
};

export type RenderableStory = {
  id: number;
  type: string;
  time: number; // unix timestamp
  timeDiff: string; // human readable time difference from now
  comments: number;
  score: number;
  title: string;
  url: string;
  by: string;
};

export type Story = {
  id: number; // PK
  type: string;
  'year-month': string; // YYYY-MM, TopByMonth GSI PK
  isEngaged: string | undefined; // y or undefined, EngagedStoriesByTime PK
  time: number; // unix timestamp, EngagedStoriesByTime SK
  comments: number;
  score: number; // TopByMonth GSI SK
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

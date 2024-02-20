export type StoryIdsResponse = number[];

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

export type HNStoryResponse = {
  by: string;
  descendants: number;
  id: number;
  kids: number[];
  score: number;
  time: number;
  title: string;
  type: string;
  url: string;
};

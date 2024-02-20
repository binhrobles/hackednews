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

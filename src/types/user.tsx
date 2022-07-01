export interface user {
  name: string;
  finished: string[];
  unfinished: { id: string; attempts: number; passedTime: number }[];
}

export interface user {
  name: string;
  finished?: string[];
  uid: string;
  gamestats?: {
    [id: string]: { start: number; finish: number };
  };
}

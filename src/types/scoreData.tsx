import { Timestamp } from "firebase/firestore";

export type ScoreData = {
  name: string;
  uid: string;
  start: Timestamp;
  finish: Timestamp;
};

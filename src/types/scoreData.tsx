import { Timestamp } from "firebase/firestore";

export interface scoreData {
  name: string;
  uid: string;
  start: Timestamp;
  finish: Timestamp;
}

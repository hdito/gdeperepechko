import { Timestamp } from "firebase/firestore";

export function countDuration(start: Timestamp, finish: Timestamp) {
  return (
    Math.round(
      10 *
        (finish.seconds +
          finish.nanoseconds * 1e-9 -
          start.seconds -
          start.nanoseconds * 1e-9),
    ) / 10
  );
}

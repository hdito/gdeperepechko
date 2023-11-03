import { MouseEvent } from "react";

export function getCoords(event: MouseEvent<HTMLDivElement>) {
  const x =
    (event.clientX - event.currentTarget.getBoundingClientRect().left) /
    event.currentTarget.clientWidth;
  const y =
    (event.clientY - event.currentTarget.getBoundingClientRect().top) /
    event.currentTarget.clientHeight;

  return { x, y };
}

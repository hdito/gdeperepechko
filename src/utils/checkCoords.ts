import { Card } from "../types/card";

export function checkCoords(x: number, y: number, coords: Card["coords"]) {
  if (x > coords.x1 && x < coords.x2 && y > coords.y1 && y < coords.y2)
    return true;
  return false;
}

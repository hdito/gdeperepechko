import { ImageIdParam } from "@/App";
import { useParams } from "react-router-dom";

export const useImageIdParams = () => {
  const { imageId } = useParams<ImageIdParam>();

  if (!imageId) {
    throw Error("Must be used only inside route with image id parameter");
  }

  return imageId;
};

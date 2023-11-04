import { storage } from "@/firebase";
import { getBlob, ref } from "firebase/storage";

export const imageQuery = async (imageId: string) => {
  const blob = await getBlob(ref(storage, `images/${imageId}.jpg`));
  return URL.createObjectURL(blob);
};

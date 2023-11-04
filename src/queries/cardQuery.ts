import { db } from "@/firebase";
import { getDoc, doc } from "firebase/firestore";

export const cardQuery = async (id: string) => {
  const card = await getDoc(doc(db, "cards", id));
  if (!card.exists()) throw Error();
  return card.data();
};

import { db } from "@/firebase";
import { User } from "@/types/user";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";

export const saveStartStateMutation = async (cardId: string, user: User) => {
  const gamestats = await setDoc(
    doc(db, "gamestats", cardId, "users", user.uid),
    {
      uid: user.uid,
      name: user.name,
      start: serverTimestamp(),
    },
  );
  return gamestats;
};

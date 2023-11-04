import { db } from "@/firebase";
import { User } from "@/types/user";
import {
  writeBatch,
  doc,
  serverTimestamp,
  arrayUnion,
} from "firebase/firestore";

export const saveFinishStateMutation = async (imageId: string, user: User) => {
  const batch = writeBatch(db);
  batch.update(doc(db, "gamestats", imageId, "users", user.uid), {
    finish: serverTimestamp(),
  });
  batch.update(doc(db, "users", user.uid), {
    finished: arrayUnion(imageId),
  });
  return batch.commit();
};

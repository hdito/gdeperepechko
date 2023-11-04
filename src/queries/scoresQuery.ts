import { db } from "@/firebase";
import { countDuration } from "@/utils/countDuration";
import { getDocs, query, collection, orderBy, limit } from "firebase/firestore";

export const scoresQuery = async (cardId: string) => {
  const scoresSnap = await getDocs(
    query(
      collection(db, "gamestats", cardId, "users"),
      orderBy("finish", "desc"),
      limit(10),
    ),
  );

  return scoresSnap.docs.map((scoreSnap) => {
    const data = scoreSnap.data();
    const score = {
      uid: data.uid,
      name: data.name,
      time: countDuration(data.start, data.finish),
    };
    return score;
  });
};

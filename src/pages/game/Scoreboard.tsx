import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { db } from "../../firebase";
import { Score } from "../../types/score";
import { ScoreData } from "../../types/scoreData";
import { User } from "../../types/user";

export const Scoreboard = ({
  user,
  cardID,
  onError,
}: {
  user: User;
  cardID: string;
  onError: () => void;
}) => {
  const [scores, setScores] = useState<Score[] | null>(null);
  const [userTime, setUserTime] = useState<number | null>(null);

  useEffect(() => {
    const unsubscribeUser = onSnapshot(
      doc(db, "gamestats", cardID, "users", user.uid),
      (docSnap) => {
        const data = docSnap.data() as ScoreData;
        if (data.finish) {
          setUserTime(
            Math.round(
              10 *
                (data.finish.seconds +
                  data.finish.nanoseconds * 1e-9 -
                  data.start.seconds -
                  data.start.nanoseconds * 1e-9),
            ) / 10,
          );
        }
      },
      () => onError(),
    );
    const unsubscribeScores = onSnapshot(
      query(
        collection(db, "gamestats", cardID, "users"),
        orderBy("finish", "desc"),
        limit(10),
      ),
      (querySnap) => {
        setScores(
          querySnap.docs.map((scoreSnap) => {
            const data = scoreSnap.data();
            if (data.finish) {
              const score = {
                uid: data.uid,
                name: data.name,
                time:
                  Math.round(
                    10 *
                      (data.finish.seconds +
                        data.finish.nanoseconds * 1e-9 -
                        data.start.seconds -
                        data.start.nanoseconds * 1e-9),
                  ) / 10,
              };
              return score;
            }
          }) as Score[],
        );
      },
      () => onError(),
    );
    return () => {
      unsubscribeScores();
      unsubscribeUser();
    };
  }, []);

  return (
    <div className="absolute left-1/2 top-4 -translate-x-1/2">
      {scores && userTime ? (
        <div className="flex flex-col gap-2 overflow-hidden rounded-2xl bg-white">
          <div className="px-8 pt-2">
            <h2 className="font-bold">Поздравляем!</h2>
            <p>
              Вы нашли Перепечко за <strong>{userTime}</strong> c.
            </p>
            <h3 className="mt-2">Последние нашедшие:</h3>
          </div>
          <table>
            <thead className="bg-gray-700 text-left text-white">
              <tr>
                <th className="px-2 py-1">№</th>
                <th className="px-2 py-1">Имя</th>
                <th className="px-2 py-1">Время, c.</th>
              </tr>
            </thead>
            <tbody>
              {scores &&
                scores.map((score, index) => (
                  <tr className="odd:bg-gray-200" key={score.uid}>
                    <td className="px-2 py-1">{index + 1}</td>
                    <td className="px-2 py-1">{score.name}</td>
                    <td className="px-2 py-1">{score.time}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
};

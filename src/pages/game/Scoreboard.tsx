import { LoadingSpinner } from "@/components/LoadingSpinner";
import { db } from "@/firebase";
import { scoresQuery } from "@/queries/scoresQuery";
import { ScoreData } from "@/types/scoreData";
import { User } from "@/types/user";
import { countDuration } from "@/utils/countDuration";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { ScoresTable } from "./ScoresTable";
import { Error as ErrorWrapper } from "@/components/Error";

type Props = {
  user: User;
  cardId: string;
};

export const Scoreboard = ({ user, cardId }: Props) => {
  const timeQuery = async () => {
    const userStatSnap = await getDoc(
      doc(db, "gamestats", cardId, "users", user.uid),
    );
    const userStat = userStatSnap.data() as ScoreData;
    if (!userStat.finish) {
      throw Error();
    }
    return countDuration(userStat.start, userStat.finish);
  };

  const { data: scores, status: scoresStatus } = useQuery({
    queryKey: ["gamestats", cardId],
    queryFn: () => scoresQuery(cardId),
  });

  const { data: userTime, status: timeStatus } = useQuery({
    queryKey: ["gamestats", cardId, user.uid],
    queryFn: timeQuery,
  });

  return (
    <div className="absolute left-1/2 top-4 -translate-x-1/2">
      {scoresStatus === "error" || timeStatus === "error" ? (
        <ErrorWrapper />
      ) : null}

      {scoresStatus === "success" && scoresStatus === "success" ? (
        <div className="flex flex-col gap-2 overflow-hidden rounded-2xl bg-white">
          <div className="px-8 pt-2">
            <h2 className="font-bold">Поздравляем!</h2>
            <p>
              Вы нашли Перепечко за <strong>{userTime}</strong>
            </p>
          </div>

          <h3 className="mt-2 px-8">Последние нашедшие:</h3>
          <ScoresTable scores={scores} />
        </div>
      ) : null}

      {scoresStatus === "pending" || timeStatus === "pending" ? (
        <LoadingSpinner />
      ) : null}
    </div>
  );
};

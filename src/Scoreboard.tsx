import { styled } from "@linaria/react";
import { useEffect, useState } from "react";
import { user } from "./types/user";
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "./firebase";
import { score } from "./types/score";
import { scoreData } from "./types/scoreData";
import { LoadingSpinner } from "./LoadingSpinner";

const PositionAbsoluteContainer = styled.div`
  position: absolute;
  top: 1rem;
  left: 50%;
  transform: translate(-50%);
`;

const ScoreboardContainer = styled.div`
  border-radius: 1rem;
  background: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  gap: 0.5rem;
`;
const HeaderContainer = styled.h2`
  padding: 0 2rem;
  margin: 1rem 0;
`;
const CTrow = styled.tr`
  &:nth-child(2n) {
    background: hsl(0, 0%, 90%);
  }
`;
const CThead = styled.thead`
  text-align: left;
  background: hsl(0, 0%, 20%);
  color: hsl(0, 0%, 95%);
`;
const CTd = styled.td`
  padding: 0.25rem 0.5rem;
`;
const CTh = styled.th`
  padding: 0.25rem 0.5rem;
`;
const CP = styled.p`
  padding: 0 2rem;
`;
export const Scoreboard = ({
  user,
  cardID,
  onError,
}: {
  user: user;
  cardID: string;
  onError: () => void;
}) => {
  const [scores, setScores] = useState<score[] | null>(null);
  const [userTime, setUserTime] = useState<number | null>(null);

  useEffect(() => {
    const unsubscribeUser = onSnapshot(
      doc(db, "gamestats", cardID, "users", user.uid),
      (docSnap) => {
        const data = docSnap.data() as scoreData;
        if (data.finish) {
          setUserTime(
            Math.round(
              10 *
                (data.finish.seconds +
                  data.finish.nanoseconds * 1e-9 -
                  data.start.seconds -
                  data.start.nanoseconds * 1e-9)
            ) / 10
          );
        }
      },
      () => onError()
    );
    const unsubscribeScores = onSnapshot(
      query(
        collection(db, "gamestats", cardID, "users"),
        orderBy("finish", "desc"),
        limit(10)
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
                        data.start.nanoseconds * 1e-9)
                  ) / 10,
              };
              return score;
            }
          }) as score[]
        );
      },
      () => onError()
    );
    return () => {
      unsubscribeScores();
      unsubscribeUser();
    };
  }, []);

  return (
    <PositionAbsoluteContainer>
      {scores && userTime ? (
        <ScoreboardContainer>
          <>
            <HeaderContainer>
              Поздравляем! {<br />}Вы нашли Перепечко за {userTime} c.
            </HeaderContainer>
            <CP>Последние нашедшие:</CP>
            <table>
              <CThead>
                <tr>
                  <CTh>№</CTh>
                  <CTh>Имя</CTh>
                  <CTh>Время, c.</CTh>
                </tr>
              </CThead>
              <tbody>
                {scores &&
                  scores.map((score, index) => (
                    <CTrow key={score.uid}>
                      <CTd>{index + 1}</CTd>
                      <CTd>{score.name}</CTd>
                      <CTd>{score.time}</CTd>
                    </CTrow>
                  ))}
              </tbody>
            </table>
          </>
        </ScoreboardContainer>
      ) : (
        <LoadingSpinner />
      )}
    </PositionAbsoluteContainer>
  );
};

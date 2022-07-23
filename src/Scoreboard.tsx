import { styled } from "@linaria/react";
import { useEffect, useState } from "react";
import { user } from "./types/user";
import {
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { card } from "./types/card";
import { db } from "./firebase";
import { score } from "./types/score";

const ScoreboardContainer = styled.div`
  position: absolute;
  top: 1rem;
  left: 50%;
  border-radius: 1rem;
  background: white;
  transform: translate(-50%);
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
export const Scoreboard = ({ user, card }: { user: user; card: card }) => {
  const [scores, setScores] = useState<score[] | null>(null);
  const [userTime, setUserTime] = useState<number | null>(null);
  useEffect(() => {
    const userRef = doc(db, "gamestats", card.id, "users", user.uid);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (!doc.exists()) return;
      if (!doc.data().finish) return;
      const data = doc.data();
      setUserTime(
        Math.round(
          10 *
            (data.finish.seconds +
              data.finish.nanoseconds * 1e-9 -
              data.start.seconds -
              data.start.nanoseconds * 1e-9)
        ) / 10
      );
      const q = query(
        collection(db, "gamestats", card.id, "users"),
        orderBy("finish", "desc"),
        limit(10)
      );
      getDocs(q).then((docs) =>
        setScores(
          docs.docs.map((scoreSnap) => {
            console.log(scoreSnap.data());
            const data = scoreSnap.data();
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
          }) as score[]
        )
      );
    });
    return () => unsubscribe();
  }, []);
  return (
    <ScoreboardContainer>
      {scores && userTime ? (
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
      ) : (
        <HeaderContainer>Загрузка...</HeaderContainer>
      )}
    </ScoreboardContainer>
  );
};

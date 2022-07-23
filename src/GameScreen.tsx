import { MouseEvent, useEffect, useRef, useState } from "react";
import { css } from "@linaria/core";
import { styled } from "@linaria/react";
import { Scoreboard } from "./Scoreboard";
import { Button } from "./Button";
import { card } from "./types/card";
import { user } from "./types/user";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

const GameContainer = styled.div`
  position: relative;
`;
const Img = styled.img`
  object-fit: cover;
  content: "";
  width: 100%;
  filter: ${(props) => (props.isPaused ? "blur(5px)" : "")};
  transform: ${(props) => (props.isPaused ? "scale(1.1)" : "")};
`;
const NavContainer = styled.nav`
  position: sticky;
  top: 0;
  background: white;
  box-shadow: 0 0 0.5rem hsl(0, 0%, 10%);
  z-index: 1;
`;
const GameBar = styled.div`
  color: white;
  background: black;
  padding: 0.2rem 2rem;
`;
const Flex = styled.div`
  padding: 1rem 2rem;
  display: flex;
`;
const PauseScreen = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
`;
const PauseMenu = styled.div`
  position: absolute;
  padding: 1rem 2rem;
  border-radius: 1rem;
  top: 1rem;
  left: 50%;
  max-width: 40ch;
  transform: translate(-50%);
  background: white;
  display: flex;
  flex-direction: column;
  line-height: 1.4;
  gap: 0.5rem;
  align-items: center;
`;
export const GameScreen = ({
  card,
  user,
  onFinished,
}: {
  card: card;
  user: user;
  onFinished: (id: string) => void;
}) => {
  const isFinished = user.finished.includes(card.id);
  const [isPaused, setIsPause] = useState(!isFinished);
  const [isFound, setIsFound] = useState(isFinished);
  const handleClick = async (e: MouseEvent<HTMLDivElement>) => {
    if (isFinished) return;
    if (isPaused) return;
    const x =
      (e.clientX - e.currentTarget.getBoundingClientRect().left) /
      e.currentTarget.clientWidth;
    const y =
      (e.clientY - e.currentTarget.getBoundingClientRect().top) /
      e.currentTarget.clientHeight;
    console.log({ x, y });
    if (
      x > card.coords[0].x &&
      x < card.coords[1].x &&
      y < card.coords[1].y &&
      y > card.coords[0].y
    ) {
      console.log("you win");
      setIsFound(true);
      onFinished(card.id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      console.log("no");
    }
  };
  const handleStart = () => {
    setIsPause(false);
    setDoc(doc(db, "gamestats", card.id, "users", user.uid), {
      uid: user.uid,
      name: user.name,
      start: serverTimestamp(),
    });
  };
  return (
    <>
      <div>
        <GameContainer onClick={(e) => handleClick(e)} src={card.src}>
          <Img isPaused={isPaused} src={card.full} />
          {isFound ? (
            <Scoreboard card={card} user={user} />
          ) : isPaused ? (
            <PauseScreen>
              <PauseMenu>
                <p>
                  Где-то на картинке спрятался Перепечко. Разыщите его как можно
                  скорее!
                </p>
                <Button onClick={() => handleStart()}>Продолжить</Button>
              </PauseMenu>
            </PauseScreen>
          ) : (
            <></>
          )}
        </GameContainer>
      </div>
    </>
  );
};

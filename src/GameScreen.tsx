import { MouseEvent, useEffect, useRef, useState } from "react";
import { css } from "@linaria/core";
import { styled } from "@linaria/react";
import { Scoreboard } from "./Scoreboard";
import { Button } from "./Button";
import { card } from "./types/card";
import { user } from "./types/user";

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
  top: 50%;
  left: 50%;
  max-width: 40ch;
  transform: translate(-50%, -50%);
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
  onMainMenu,
}: {
  card: card;
  user: user;
  onFinished: (id: string) => void;
  onMainMenu: () => void;
}) => {
  const [attempts, setAttempts] = useState(() => 0);
  const isFinished = user.finished.includes(card.id);
  const [isPaused, setIsPause] = useState(!isFinished);
  const passedTime =
    user.unfinished.find((item) => item.id === card.id)?.passedTime ?? 0;
  const timer = useRef(Date.now());
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (isFinished) return;
    if (isPaused) return;
    const x =
      (e.clientX - e.currentTarget.getBoundingClientRect().left) /
      e.currentTarget.clientWidth;
    const y =
      (e.clientY - e.currentTarget.getBoundingClientRect().top) /
      e.currentTarget.clientHeight;
    console.log({ x, y });
    if (x > 0.415 && x < 0.44 && y < 0.705 && y > 0.55) {
      timer.current = Date.now() - timer.current;
      console.log("you win");
      onFinished(card.id);
    } else {
      setAttempts((attempts) => attempts + 1);
      console.log("no");
    }
  };
  return (
    <>
      <NavContainer>
        <Flex>
          <Button onClick={() => onMainMenu()}>Главное меню</Button>
          <Button style={{ marginLeft: "auto" }}>
            {user ? "Выйти" : "Войти"}
          </Button>
        </Flex>
        <GameBar>Попытки: {attempts} </GameBar>
      </NavContainer>
      <div>
        <GameContainer onClick={(e) => handleClick(e)} src={card.src}>
          <Img isPaused={isPaused} src={card.src} />
          {isFinished ? (
            <Scoreboard time={timer.current} />
          ) : isPaused ? (
            <PauseScreen>
              <PauseMenu>
                <p>
                  Где-то на картинке спрятался Перепечко. Разыщите его как можно
                  скорее!
                </p>
                <Button onClick={() => setIsPause(false)}>Продолжить</Button>
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

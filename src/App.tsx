import { css } from "@linaria/core";
import { useState } from "react";
import { GameScreen } from "./GameScreen";
import { images } from "./images";
import { MainMenu } from "./MainMenu";
import { card } from "./types/card";
import { user } from "./types/user";
const globals = css`
  :global() {
    :root {
      font-family: Helvetica, sans-serif;
    }
    h1,
    h2,
    h3,
    p,
    body {
      margin: 0;
    }
    h1,
    h2,
    h3 {
      cursor: default;
    }
  }
`;

export const App = () => {
  const [user, setUser] = useState<user>(
    JSON.parse(sessionStorage?.user ?? '{"name": "User","finished":[]}')
  );
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const showMainMenu = () => {
    setSelectedCardId(null);
  };
  const handleFinish = (id: string) => {
    setUser({
      ...user,
      finished: [...user.finished, selectedCardId as string],
      unfinished: [...user.unfinished.filter((item) => item.id !== id)],
    });
  };
  return (
    <>
      {selectedCardId === null ? (
        <MainMenu
          onSelectedCardId={(id) => setSelectedCardId(id)}
          user={user}
        />
      ) : (
        <GameScreen
          user={user}
          card={images.find((image) => image.id === selectedCardId) as card}
          onMainMenu={showMainMenu}
          onFinished={handleFinish}
        />
      )}
    </>
  );
};

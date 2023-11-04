import { Button } from "@/components/Button";
import { Error } from "@/components/Error";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useUser } from "@/contexts/UserProvider";
import { auth } from "@/firebase";
import { useImageIdParams } from "@/hooks/useImageIdParams";
import { saveFinishStateMutation } from "@/mutations/saveFinishStateMutation";
import { saveStartStateMutation } from "@/mutations/saveStartStateMutation";
import { cardQuery } from "@/queries/cardQuery";
import { imageQuery } from "@/queries/imageQuery";
import { User } from "@/types/user";
import { checkCoords } from "@/utils/checkCoords";
import { getCoords } from "@/utils/getCoords";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { MouseEvent, useState } from "react";
import { PauseMenu } from "./PauseMenu";
import { Scoreboard } from "./Scoreboard";

type GameStatus = "finished" | "in progress" | "paused";

export const GameScreen = () => {
  const user = useUser();
  const imageId = useImageIdParams();

  const [gameStatus, setGameStatus] = useState<GameStatus>(() => {
    if (user?.finished?.includes(imageId)) return "finished";
    return "paused";
  });

  const { mutateAsync: saveFinishState, status: saveFinishStateStatus } =
    useMutation({
      mutationFn: (user: User) => saveFinishStateMutation(imageId, user),
    });

  const { mutateAsync: saveStartTime, status: saveStartStateStatus } =
    useMutation({
      mutationFn: () => saveStartStateMutation(imageId, user!),
      onSuccess: () => setGameStatus("in progress"),
    });

  const { data: image, status: imageStatus } = useQuery({
    queryKey: ["cards", imageId, "image"],
    queryFn: () => imageQuery(imageId),
  });

  const { data: card } = useQuery({
    queryKey: ["cards", imageId],
    queryFn: () => cardQuery(imageId),
  });

  const handleClick = async (e: MouseEvent<HTMLDivElement>) => {
    if (!user) return;
    if (!card) return;

    const { x, y } = getCoords(e);

    if (!checkCoords(x, y, card.coords)) return;

    setGameStatus("finished");
    window.scrollTo({ top: 0, behavior: "smooth" });

    await saveFinishState(user);
  };

  const handleStart = async () => {
    if (!user) return;
    if (!card) return;

    await saveStartTime();
  };

  return (
    <div className="relative flex h-full flex-col">
      {imageStatus === "error" ? <Error /> : null}
      {imageStatus === "success" ? (
        <div className="overflow-hidden">
          <img
            onClick={handleClick}
            src={image}
            className={`h-full w-full object-contain transition-all ${
              gameStatus === "paused" ? "scale-110 blur" : ""
            }`}
          />
          {gameStatus === "finished" ? (
            saveFinishStateStatus !== "pending" ? (
              <Scoreboard user={user as User} cardId={imageId} />
            ) : (
              <LoadingSpinner />
            )
          ) : null}
          {gameStatus === "paused" ? (
            <PauseMenu>
              {saveStartStateStatus === "error" ? <Error /> : null}
              {user ? (
                <>
                  <p>
                    Где-то на картинке спрятался Перепечко. Разыщите его как
                    можно скорее!
                  </p>
                  <Button onClick={handleStart}>
                    {saveStartStateStatus === "pending"
                      ? "Загрузка..."
                      : "Начать"}
                  </Button>
                </>
              ) : (
                <>
                  <p>Для продолжения войдите</p>
                  <Button
                    onClick={() =>
                      signInWithPopup(auth, new GoogleAuthProvider())
                    }
                  >
                    Войти через Google
                  </Button>
                </>
              )}
            </PauseMenu>
          ) : null}
        </div>
      ) : null}
      {imageStatus === "pending" ? <LoadingSpinner /> : null}
    </div>
  );
};

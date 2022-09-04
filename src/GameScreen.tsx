import { styled } from "@linaria/react";
import {
  getDoc,
  doc,
  setDoc,
  serverTimestamp,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db, storage } from "./firebase";
import { useUser } from "./UserProvider";
import { card } from "./types/card";
import { MouseEvent } from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import { Button } from "./Button";
import { Scoreboard } from "./Scoreboard";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { user } from "./types/user";

const GameContainer = styled.div`
  position: relative;
  height: 100%;
`;
const Img = styled.img`
  display: ${(props) => (!props.imageLoading ? "block" : "none")};
  filter: ${(props) => (props.pause ? "blur(0.5rem)" : "")};
  object-fit: contain;
  width: 100%;
  transform: ${(props) => (props.pause ? "scale(1.1)" : "")};
  transition: all 0.2s;
`;
const PauseContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  padding: 1rem;
  box-sizing: border-box;
`;
const PauseMenu = styled.div`
  max-width: 40ch;
  margin: auto;
  background: white;
  border-radius: 1rem;
  padding: 1rem;
  display: flex;
  gap: 1rem;
  flex-direction: column;
`;

export const GameScreen = () => {
  const user = useUser();
  const { imageID } = useParams();
  const [card, setCard] = useState<card | null>(null);
  const [pause, setPause] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  let finished = false;

  if (user?.finished) {
    finished = user.finished.includes(imageID as string);
  }
  const navigate = useNavigate();
  const initializeScreen = async () => {
    const docSnap = await getDoc(doc(db, "cards", imageID as string));
    if (docSnap.exists()) {
      const cardInfo = docSnap.data() as card;
      cardInfo.link = await getDownloadURL(
        ref(storage, `images/${docSnap.data().id}.jpg`)
      );
      setCard(cardInfo);
    } else {
      navigate("/");
    }
  };
  useEffect(() => {
    initializeScreen().catch((error) => alert(error));
  }, []);

  const handleClick = async (e: MouseEvent<HTMLDivElement>) => {
    if (!user) return;
    if (!card) return;
    if (finished) return;
    const x =
      (e.clientX - e.currentTarget.getBoundingClientRect().left) /
      e.currentTarget.clientWidth;
    const y =
      (e.clientY - e.currentTarget.getBoundingClientRect().top) /
      e.currentTarget.clientHeight;
    console.log({ x, y });
    if (
      x > card.coords.x1 &&
      x < card.coords.x2 &&
      y > card.coords.y1 &&
      y < card.coords.y2
    ) {
      console.log("you win");
      window.scrollTo({ top: 0, behavior: "smooth" });
      await Promise.all([
        updateDoc(doc(db, "gamestats", imageID as string, "users", user.uid), {
          finish: serverTimestamp(),
        }),
        updateDoc(doc(db, "users", user.uid), {
          finished: arrayUnion(imageID as string),
        }),
      ]);
    } else {
      console.log("no");
    }
  };
  const handleStart = async () => {
    if (!user) return;
    if (!card) return;
    await setDoc(doc(db, "gamestats", card.id, "users", user.uid), {
      uid: user.uid,
      name: user.name,
      start: serverTimestamp(),
    });
    setPause(false);
  };
  return (
    <GameContainer>
      <Img
        user={user}
        pause={pause}
        imageLoading={imageLoading}
        onLoad={() => setImageLoading(false)}
        onClick={handleClick}
        src={card?.link}
      />
      {!imageLoading ? (
        <>
          {finished ? (
            <Scoreboard user={user as user} cardID={imageID as string} />
          ) : (
            <>
              {pause && (
                <PauseContainer>
                  <PauseMenu>
                    {user ? (
                      <>
                        <p>
                          Где-то на картинке спрятался Перепечко. Разыщите его
                          как можно скорее!
                        </p>
                        <Button onClick={() => handleStart()}>Начать</Button>
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
                </PauseContainer>
              )}
            </>
          )}
        </>
      ) : (
        <LoadingSpinner />
      )}
    </GameContainer>
  );
};

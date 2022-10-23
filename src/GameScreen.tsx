import { styled } from "@linaria/react";
import {
  getDoc,
  doc,
  setDoc,
  serverTimestamp,
  updateDoc,
  arrayUnion,
  writeBatch,
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
import { Error } from "./Error";
import { PauseMenu } from "./PauseMenu";

const GameContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Img = styled.img`
  display: ${(props) => (!props.imageLoading ? "block" : "none")};
  filter: ${(props) => (props.pause ? "blur(0.5rem)" : "")};
  object-fit: contain;
  width: 100%;
  transform: ${(props) => (props.pause ? "scale(1.1)" : "")};
  transition: all 0.2s;
`;

export const GameScreen = () => {
  const user = useUser();
  const params = useParams();
  const imageID = params.imageID as string;
  const [card, setCard] = useState<card | null>(null);
  const [pause, setPause] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);

  let finished = false;

  if (user?.finished) {
    finished = user.finished.includes(imageID);
  }
  const navigate = useNavigate();

  const initializeScreen = async () => {
    try {
      const docSnap = await getDoc(doc(db, "cards", imageID));
      if (docSnap.exists()) {
        const cardInfo = docSnap.data() as card;
        cardInfo.link = await getDownloadURL(
          ref(storage, `images/${docSnap.data().id}.jpg`)
        );
        setCard(cardInfo);
      } else {
        navigate("/");
      }
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    initializeScreen();
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

    if (
      x > card.coords.x1 &&
      x < card.coords.x2 &&
      y > card.coords.y1 &&
      y < card.coords.y2
    ) {
      window.scrollTo({ top: 0, behavior: "smooth" });

      const batch = writeBatch(db);
      batch.update(doc(db, "gamestats", imageID, "users", user.uid), {
        finish: serverTimestamp(),
      });
      batch.update(doc(db, "users", user.uid), {
        finished: arrayUnion(imageID),
      });
      try {
        await batch.commit();
      } catch (error) {
        setError(error);
      }
    }
  };

  const handleStart = async () => {
    if (!user) return;
    if (!card) return;

    try {
      await setDoc(doc(db, "gamestats", card.id, "users", user.uid), {
        uid: user.uid,
        name: user.name,
        start: serverTimestamp(),
      });
    } catch (error) {
      setError(error);
    }
    setPause(false);
  };

  return (
    <GameContainer>
      {error !== null ? (
        <Error />
      ) : (
        <>
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
                <Scoreboard
                  user={user as user}
                  cardID={imageID}
                  onError={() => setError(true)}
                />
              ) : (
                <>{pause && <PauseMenu onStart={handleStart} />}</>
              )}
            </>
          ) : (
            <LoadingSpinner />
          )}
        </>
      )}
    </GameContainer>
  );
};

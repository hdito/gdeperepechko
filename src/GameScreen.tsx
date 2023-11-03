import {
  arrayUnion,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { MouseEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Error } from "./Error";
import { LoadingSpinner } from "./LoadingSpinner";
import { PauseMenu } from "./PauseMenu";
import { Scoreboard } from "./Scoreboard";
import { useUser } from "./UserProvider";
import { db, storage } from "./firebase";
import { card } from "./types/card";
import { user } from "./types/user";

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
          ref(storage, `images/${docSnap.data().id}.jpg`),
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
    <div className="relative flex flex-1 flex-col overflow-hidden">
      {error !== null ? (
        <Error />
      ) : (
        <>
          <img
            onLoad={() => {
              setImageLoading(false);
            }}
            onClick={handleClick}
            src={card?.link}
            className={`w-full object-contain transition-all ${
              pause ? "scale-110 blur" : ""
            } ${imageLoading ? "block" : "none"}`}
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
    </div>
  );
};

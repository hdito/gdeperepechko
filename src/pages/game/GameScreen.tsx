import {
  arrayUnion,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { MouseEvent, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Error } from "../../components/Error";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { PauseMenu } from "./PauseMenu";
import { Scoreboard } from "./Scoreboard";
import { useUser } from "../../contexts/UserProvider";
import { db, storage } from "../../firebase";
import { Card } from "../../types/card";
import { User } from "../../types/user";
import { getCoords } from "../../utils/getCoords";
import { checkCoords } from "../../utils/checkCoords";

export const GameScreen = () => {
  const user = useUser();
  const params = useParams();
  const imageID = params.imageID as string;
  const [card, setCard] = useState<Card | null>(null);
  const [pause, setPause] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);

  let isFinished = useMemo(() => {
    if (user?.finished?.includes(imageID)) return true;
    return false;
  }, [user?.finished]);

  const navigate = useNavigate();

  const initializeScreen = async () => {
    try {
      const docSnap = await getDoc(doc(db, "cards", imageID));
      if (docSnap.exists()) {
        const cardInfo = docSnap.data() as Card;
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
    if (isFinished) return;

    const { x, y } = getCoords(e);

    if (checkCoords(x, y, card.coords)) {
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
              {isFinished ? (
                <Scoreboard
                  user={user as User}
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

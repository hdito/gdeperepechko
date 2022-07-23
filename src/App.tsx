import { css } from "@linaria/core";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import { auth, db, signIn, updateFinished } from "./firebase";
import { GameScreen } from "./GameScreen";
import { images } from "./images";
import { MainMenu } from "./MainMenu";
import { Nav } from "./Nav";
import { card } from "./types/card";
import { user } from "./types/user";
import { useAuthState } from "react-firebase-hooks/auth";
import { styled } from "@linaria/react";
import { Button } from "./Button";
import {
  addDoc,
  query,
  collection,
  getDoc,
  where,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";
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
    table,
    tr,
    td,
    th,
    thead,
    tbody {
      border: none;
      border-collapse: collapse;
    }
  }
`;
const AppContainer = styled.div`
  position: relative;
`;
const Popup = styled.div`
  position: absolute;
  padding:1rem 2rem
  z-index:2;
  border-radius:1rem;
  background: hsl(0,0%,80%);
  display:flex;
  gap:0.5rem;
  align-items:center;
  flex-direction:column;
  top: 1rem;
  left: 50%;
  transform: translate(-50%);
`;
export const App = () => {
  const [user, setUser] = useState<user | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const unsubUser = useRef<null | Unsubscribe>(null);
  const showMainMenu = () => {
    setSelectedCardId(null);
  };
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user && user.displayName) {
        const userCheck = await getDoc(doc(db, "users", user.uid));
        if (!userCheck.exists()) {
          const userData = {
            name: user.displayName,
            finished: [],
            uid: user.uid,
          };
          await setDoc(doc(db, "users", user.uid), userData);
        }
        unsubUser.current = onSnapshot(doc(db, "users", user.uid), (doc) =>
          setUser(doc.data() as user)
        );
      } else {
        if (unsubUser.current) {
          unsubUser.current();
          unsubUser.current = null;
        }
        setUser(null);
      }
    });
    return () => unsubscribeAuth();
  }, []);
  const mode = selectedCardId ? "game" : "menu";
  const handleFinish = async (id: string) => {
    if (!user) return;
    updateFinished(user, id);
    updateDoc(doc(db, "gamestats", id, "users", user.uid), {
      finish: serverTimestamp(),
    });
  };

  return (
    <AppContainer>
      <Nav user={user} onMainMenu={showMainMenu} mode={mode} />
      {selectedCardId === null ? (
        <MainMenu
          onSelectedCardId={(id) => setSelectedCardId(id)}
          user={user}
          onShowPopup={() => setShowPopup(true)}
        />
      ) : (
        user !== null && (
          <GameScreen
            user={user}
            card={images.find((image) => image.id === selectedCardId) as card}
            onFinished={(id) => {
              handleFinish(id);
            }}
          />
        )
      )}
      {showPopup && (
        <Popup>
          Для продолжения войдите
          <Button
            onClick={() => {
              signIn();
              setShowPopup(false);
            }}
          >
            Войте через Google
          </Button>
          <Button onClick={() => setShowPopup(false)}>Закрыть</Button>
        </Popup>
      )}
    </AppContainer>
  );
};

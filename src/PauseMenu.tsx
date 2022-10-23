import { styled } from "@linaria/react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Button } from "./Button";
import { auth } from "./firebase";
import { useUser } from "./UserProvider";

const PauseContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  padding: 1rem;
  box-sizing: border-box;
`;

const PauseContents = styled.div`
  max-width: 40ch;
  margin: auto;
  background: white;
  border-radius: 1rem;
  padding: 1rem;
  display: flex;
  gap: 1rem;
  flex-direction: column;
`;

export const PauseMenu = ({ onStart }: { onStart: () => void }) => {
  const user = useUser();
  return (
    <PauseContainer>
      <PauseContents>
        {user ? (
          <>
            <p>
              Где-то на картинке спрятался Перепечко. Разыщите его как можно
              скорее!
            </p>
            <Button onClick={() => onStart()}>Начать</Button>
          </>
        ) : (
          <>
            <p>Для продолжения войдите</p>
            <Button
              onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}
            >
              Войти через Google
            </Button>
          </>
        )}
      </PauseContents>
    </PauseContainer>
  );
};

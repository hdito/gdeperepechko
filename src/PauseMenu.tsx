import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Button } from "./Button";
import { useUser } from "./UserProvider";
import { auth } from "./firebase";

export const PauseMenu = ({ onStart }: { onStart: () => void }) => {
  const user = useUser();
  return (
    <div className="absolute left-0 top-0 h-full w-full p-4">
      <div className="m-auto flex max-w-[40ch] flex-col gap-4 rounded-2xl bg-white p-4">
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
      </div>
    </div>
  );
};

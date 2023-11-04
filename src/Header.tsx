import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { Link, useParams } from "react-router-dom";
import { useUser } from "./contexts/UserProvider";
import { Button } from "./components/Button";
import { auth } from "./firebase";
import { ImageIdParam } from "./App";

export const Header = () => {
  const params = useParams<ImageIdParam>();
  const user = useUser();

  return (
    <header className="sticky top-0 z-10 bg-white shadow-md">
      <div className="flex flex-wrap items-center gap-4 p-4 sm:px-8 sm:py-4">
        <img className="h-10" src="/logo.png" alt="Перепечко" />
        {params.imageId ? (
          <Link
            className="text-lg font-bold transition-all hover:underline"
            to="/"
          >
            Главное меню
          </Link>
        ) : null}
        {user ? (
          <>
            <div className="ml-auto">{user.name}</div>
            <Button onClick={() => signOut(auth)}>Выйти</Button>
          </>
        ) : (
          <Button
            className="ml-auto"
            onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}
          >
            Войти через Google
          </Button>
        )}
      </div>
    </header>
  );
};

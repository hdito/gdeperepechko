import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { Link, useParams } from "react-router-dom";
import { useUser } from "./contexts/UserProvider";
import { Button } from "./components/Button";
import { auth } from "./firebase";

export const Header = () => {
  const params = useParams();
  const user = useUser();

  return (
    <header className="sticky top-0 z-10 bg-white shadow-md">
      <div className="flex flex-wrap items-center gap-4 p-4 sm:px-8 sm:py-4">
        <img className="h-10" src="/logo.png" alt="Перепечко" />
        {params?.imageID && (
          <Link
            className="text-lg font-bold transition-all hover:underline"
            to="/"
          >
            Главное меню
          </Link>
        )}
        {user ? (
          <>
            <h2 className="ml-auto">{user.name}</h2>
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

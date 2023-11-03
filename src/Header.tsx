import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { Link, Outlet, useParams } from "react-router-dom";
import { Button } from "./Button";
import { useUser } from "./UserProvider";
import { auth } from "./firebase";

export const Header = ({}) => {
  const params = useParams();
  const user = useUser();
  return (
    <>
      <nav className="sticky top-0 z-10 bg-white shadow-md">
        <div className="flex flex-wrap items-center gap-4 p-4 sm:px-8 sm:py-4">
          <img className="h-10" src="/logo.png" alt="" />
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
      </nav>
      <Outlet />
    </>
  );
};

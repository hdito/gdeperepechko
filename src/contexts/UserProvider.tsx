import { doc, FirestoreError, onSnapshot, setDoc } from "firebase/firestore";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthProvider";
import { Error } from "../components/Error";
import { db } from "../firebase";
import { User } from "../types/user";

const UserContext = createContext<User | null>(null);
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<FirestoreError | null>(null);
  const [loading, setLoading] = useState(true);
  const authState = useAuth();
  useEffect(() => {
    if (authState === null) {
      setUser(null);
      setLoading(false);
      return;
    }
    const unsubscribeUser = onSnapshot(
      doc(db, "users", authState.uid),
      (docSnap) => {
        if (docSnap.exists()) {
          setUser(docSnap.data() as User);
          setLoading(false);
        } else {
          setDoc(doc(db, "users", authState.uid), {
            name: authState.displayName,
            uid: authState.uid,
          });
        }
      },
      (error) => {
        setError(error);
        setLoading(false);
      },
    );
    return unsubscribeUser;
  }, [authState]);
  return (
    <UserContext.Provider value={user}>
      {error === null ? !loading && children : <Error />}
    </UserContext.Provider>
  );
};

import { doc, onSnapshot, setDoc } from "firebase/firestore";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthProvider";
import { db } from "./firebase";
import { user } from "./types/user";

const UserContext = createContext<user | null>(null);
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<user | null>(null);
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
      async (docSnap) => {
        if (docSnap.exists()) {
          setUser(docSnap.data() as user);
          setLoading(false);
        } else {
          await setDoc(doc(db, "users", authState.uid), {
            name: authState.displayName,
            uid: authState.uid,
          });
          setLoading(false);
        }
      }
    );
    return unsubscribeUser;
  }, [authState]);
  return (
    <UserContext.Provider value={user}>
      {!loading && children}
    </UserContext.Provider>
  );
};

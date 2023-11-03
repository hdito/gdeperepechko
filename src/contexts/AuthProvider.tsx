import { onAuthStateChanged, User } from "firebase/auth";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth } from "../firebase";

const AuthContext = createContext<User | null>(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [authState, setAuthState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setAuthState(user);
      setLoading(false);
    });
    return unsubscribeAuth;
  }, []);

  return (
    <AuthContext.Provider value={authState}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

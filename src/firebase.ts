import {
  getAuth,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  onAuthStateChanged,
} from "firebase/auth";
import {
  query,
  collection,
  where,
  getFirestore,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { user } from "./types/user";

const firebaseConfig = {
  apiKey: "AIzaSyCHV7loVBBRbnNulVYVl9ghfZ1ZtjJc3a8",
  authDomain: "gdeperepechko-61632.firebaseapp.com",
  projectId: "gdeperepechko-61632",
  storageBucket: "gdeperepechko-61632.appspot.com",
  messagingSenderId: "144530427971",
  appId: "1:144530427971:web:5940162a36c14fbd1084f6",
};
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();

export const signIn = async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.log(error);
    alert(error);
  }
};
export const logout = () => signOut(auth);
export const updateFinished = (user: user, id: string) =>
  updateDoc(doc(db, `users/${user.uid}`), {
    finished: arrayUnion(id),
  });

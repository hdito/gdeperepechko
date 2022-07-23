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
  apiKey: "AIzaSyAdIlIXyI9U9FJYvi1fkDRzBuT6upIbWlA",
  authDomain: "etoperepechko.firebaseapp.com",
  projectId: "etoperepechko",
  storageBucket: "etoperepechko.appspot.com",
  messagingSenderId: "828516099057",
  appId: "1:828516099057:web:45c8e429ef274699741a50",
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

import { getDocs, collection } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "@/firebase";
import { Card } from "@/types/card";

export const cardsQuery = async () => {
  const cardsSnapshot = await getDocs(collection(db, "cards"));

  const newCards: Card[] = [];
  const imageLinks: Promise<string>[] = [];

  cardsSnapshot.forEach((cardSnapshot) => {
    if (!cardSnapshot.exists()) return;

    const newCard = cardSnapshot.data() as Card;
    imageLinks.push(getDownloadURL(ref(storage, `cards/${newCard.id}.jpg`)));
    newCards.push(newCard);
  });

  const resolvedLinks = await Promise.all(imageLinks);
  resolvedLinks.map((link, i) => (newCards[i].link = link));

  return newCards;
};

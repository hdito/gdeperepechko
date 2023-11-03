import { collection, onSnapshot } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { ImageCard } from "./ImageCard";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { useUser } from "../../contexts/UserProvider";
import { db, storage } from "../../firebase";
import { Card } from "../../types/card";

export const MainMenu = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useUser();

  useEffect(() => {
    const unsubscribeCards = onSnapshot(
      collection(db, "cards"),
      async (querySnap) => {
        const newCards: Card[] = [];
        const links: Promise<string>[] = [];
        querySnap.forEach(async (docSnap) => {
          if (docSnap.exists()) {
            const newCard = docSnap.data() as Card;
            links.push(getDownloadURL(ref(storage, `cards/${newCard.id}.jpg`)));
            newCards.push(newCard);
          }
        });
        const resolvedLinks = await Promise.all(links);
        resolvedLinks.map((link, i) => (newCards[i].link = link));
        setLoading(false);
        setCards(newCards);
      },
    );
    return unsubscribeCards;
  }, []);

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="flex-1 p-4">
          <div className="m-auto grid max-w-prose grid-cols-[repeat(auto-fit,_minmax(175px,_1fr))] gap-4">
            {cards.map((card) => (
              <ImageCard
                card={card}
                isFinished={user?.finished?.includes(card.id) ?? false}
                key={card.id}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

import { collection, onSnapshot } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LoadingSpinner } from "./LoadingSpinner";
import { useUser } from "./UserProvider";
import { db, storage } from "./firebase";
import { card } from "./types/card";

export const MainMenu = () => {
  const [cards, setCards] = useState<card[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useUser();
  useEffect(() => {
    const unsubscribeCards = onSnapshot(
      collection(db, "cards"),
      async (querySnap) => {
        const newCards: card[] = [];
        const links: Promise<string>[] = [];
        querySnap.forEach(async (docSnap) => {
          if (docSnap.exists()) {
            const newCard = docSnap.data() as card;
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
          <div className="m-auto grid max-w-prose grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))] gap-4">
            {cards.map((card) => (
              <Link
                className="group aspect-[4/3] overflow-hidden rounded-2xl transition-shadow hover:shadow-md"
                key={card.id}
                to={card.id}
              >
                <div className="relative h-full">
                  <img
                    className={`h-full w-full object-cover object-center transition-all group-hover:scale-105 ${
                      user?.finished?.includes(card.id) ? "brightness-50" : ""
                    }`}
                    src={card.link}
                  />
                  {user && user?.finished?.includes(card.id) && (
                    <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center p-2 text-center text-xl font-bold text-white">
                      Перепечко найден!
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

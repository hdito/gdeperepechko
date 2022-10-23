import { styled } from "@linaria/react";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, storage } from "./firebase";
import { card } from "./types/card";
import { getDownloadURL, ref } from "firebase/storage";
import { Link } from "react-router-dom";
import { css } from "@linaria/core";
import { useUser } from "./UserProvider";
import { LoadingSpinner } from "./LoadingSpinner";

const Container80Ch = styled.div`
  padding: 1rem;
  flex: 1;
`;

const Grid = styled.div`
  max-width: 80ch;
  margin: auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: center;
  transition: 0.1s ease-in-out;
  filter: ${(props) => (props.isFinished ? "brightness(50%)" : "")};
`;

const linkClass = css`
  aspect-ratio: 4 /3;
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.1s ease-in;
  box-shadow: 0 0.25rem 0.5rem hsl(0, 0%, 30%);
  &:hover {
    box-shadow: 0 0.25rem 0.5rem hsl(0, 0%, 10%);
    & img {
      transform: scale(1.05);
    }
  }
`;

const MessageOverImage = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: bold;
  color: white;
  text-align: center;
  box-sizing: border-box;
`;

const ImageHolder = styled.div`
  position: relative;
  height: 100%;
`;

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
      }
    );
    return unsubscribeCards;
  }, []);

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Container80Ch>
          <Grid>
            {cards.map((card) => (
              <Link className={linkClass} key={card.id} to={card.id}>
                <ImageHolder>
                  <Img
                    isFinished={user && user?.finished?.includes(card.id)}
                    src={card.link}
                  />
                  {user && user?.finished?.includes(card.id) && (
                    <MessageOverImage>Перепечко найден!</MessageOverImage>
                  )}
                </ImageHolder>
              </Link>
            ))}
          </Grid>
        </Container80Ch>
      )}
    </>
  );
};

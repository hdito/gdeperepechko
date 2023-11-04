import { Card } from "@/types/card";
import { ImageCard } from "./ImageCard";

type Props = {
  cards: Card[];
  finishedCards?: string[];
};

export const ImageCardList = ({ cards, finishedCards }: Props) => {
  return (
    <div className="m-auto grid max-w-prose grid-cols-[repeat(auto-fit,_minmax(175px,_1fr))] gap-4">
      {cards.map((card) => (
        <ImageCard
          card={card}
          isFinished={finishedCards?.includes(card.id) ?? false}
          key={card.id}
        />
      ))}
    </div>
  );
};

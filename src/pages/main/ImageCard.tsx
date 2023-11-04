import { Link } from "react-router-dom";
import { Card } from "@/types/card";

type Props = {
  card: Card;
  isFinished: boolean;
};

export const ImageCard = ({ card, isFinished }: Props) => {
  return (
    <Link
      className="group relative aspect-[4/3] overflow-hidden rounded-2xl transition-shadow hover:shadow-md"
      key={card.id}
      to={card.id}
    >
      <img
        className={`h-full w-full object-cover object-center transition-all group-hover:scale-105 ${
          isFinished ? "brightness-50" : ""
        }`}
        src={card.link}
      />
      {isFinished ? (
        <div className="absolute inset-0 flex items-center justify-center p-2 text-center text-xl font-bold text-white">
          Перепечко найден!
        </div>
      ) : null}
    </Link>
  );
};

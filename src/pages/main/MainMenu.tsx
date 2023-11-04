import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useUser } from "@/contexts/UserProvider";
import { cardsQuery } from "@/queries/cardsQuery";
import { ImageCardList } from "./ImageCardList";
import { Error } from "@/components/Error";

export const MainMenu = () => {
  const user = useUser();

  const { data, status } = useQuery({
    queryKey: ["cards"],
    queryFn: cardsQuery,
  });

  return (
    <div className="p-4">
      {status === "pending" ? <LoadingSpinner /> : null}
      {status === "success" ? (
        <ImageCardList cards={data} finishedCards={user?.finished} />
      ) : null}
      {status === "error" ? <Error /> : null}
    </div>
  );
};

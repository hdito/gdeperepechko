import { styled } from "@linaria/react";
import { images } from "./images";
import { user } from "./types/user";

const Card = styled.button`
  aspect-ratio: 4 / 3;
  border-radius: 1.5rem;
  overflow: hidden;
  padding: 1rem;
  display: flex;
  border: none;
  justify-content: center;
  align-items: center;
  background-image: ${(props) =>
    props.image ? "url(" + props.image + ")" : "blue"};
  background-color: ${(props) => (props.isFinished ? " hsl(0, 0%, 30%)" : "")};
  background-size: cover;
  background-blend-mode: multiply;
  transition: all 0.1s;
  &:hover {
    opacity: 0.7;
    border-radius: 1rem;
  }
`;

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
const FindMessage = styled.h3`
  font-size: 1.5rem;
  color: white;
`;

export const MainMenu = ({
  user,
  onSelectedCardId,
  onShowPopup,
}: {
  user: user | null;
  onSelectedCardId: (id: string) => void;
  onShowPopup: () => void;
}) => {
  const selectCard = (id: string) => {
    if (!user) {
      onShowPopup();
      return;
    }
    onSelectedCardId(id);
  };

  return (
    <>
      <Container80Ch>
        <Grid>
          {images.map((image) => (
            <Card
              isFinished={user?.finished.includes(image.id) ?? false}
              image={image.src}
              key={image.id}
              onClick={() => selectCard(image.id)}
            >
              {(user?.finished.includes(image.id) ?? false) && (
                <FindMessage>Перепечко найден!</FindMessage>
              )}
            </Card>
          ))}
        </Grid>
      </Container80Ch>
    </>
  );
};

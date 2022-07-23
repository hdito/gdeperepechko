import { styled } from "@linaria/react";
import { images } from "./images";
import { user } from "./types/user";

const Card = styled.button`
  aspect-ratio: 4 / 3;
  border-radius: 1rem;
  overflow: hidden;
  padding: 1rem;
  display: flex;
  border: none;
  align-items: center;
  background-image: ${(props) =>
    props.image ? "url(" + props.image + ")" : "blue"};
  background-color: ${(props) => (props.isFinished ? " hsl(0, 0%, 30%)" : "")};
  background-size: cover;
  background-blend-mode: multiply;

  &:hover {
    opacity: 0.7;
    outline: 0.3rem solid hsl(214, 100%, 50%);
  }
`;

const Container80Ch = styled.div`
  max-width: 80ch;
  padding: 1rem;
  margin: auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
`;
const FindMessage = styled.h3`
  font-size: 1.5rem;
  color: white;
  text-align: center;
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
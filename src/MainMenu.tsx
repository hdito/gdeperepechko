import { styled } from "@linaria/react";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { Button } from "./Button";
import { GameScreen } from "./GameScreen";
import { images } from "./images";
import { card } from "./types/card";
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
const Flex = styled.div`
  padding: 1rem 2rem;
  display: flex;
`;
const NavContainer = styled.nav`
  position: sticky;
  top: 0;
  background: white;
  box-shadow: 0 0 0.5rem hsl(0, 0%, 30%);
  z-index: 1;
`;
export const MainMenu = ({
  user,
  onSelectedCardId,
}: {
  user: user;
  onSelectedCardId: (id: string) => void;
}) => {
  console.log(user);

  return (
    <>
      <NavContainer>
        <Flex>
          <Button style={{ marginLeft: "auto" }}>
            {user ? "Sign out" : "Sign in"}
          </Button>
        </Flex>
      </NavContainer>
      <Container80Ch>
        <Grid>
          {images.map((image) => (
            <Card
              isFinished={user.finished.includes(image.id)}
              image={image.src}
              key={image.id}
              onClick={() => {
                onSelectedCardId(image.id);
              }}
            >
              {user.finished.includes(image.id) && (
                <FindMessage>Перепечко найден!</FindMessage>
              )}
            </Card>
          ))}
        </Grid>
      </Container80Ch>
    </>
  );
};

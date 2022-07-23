import { styled } from "@linaria/react";
import { Button } from "./Button";
import { logout, signIn } from "./firebase";
import { user } from "./types/user";

const NavContainer = styled.nav`
  position: sticky;
  top: 0;
  background: white;
  box-shadow: 0 0 0.5rem hsl(0, 0%, 30%);
  z-index: 1;
`;
const Flex = styled.div`
  padding: 1rem 2rem;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  flex-wrap: wrap;
`;

export const Nav = ({
  user,
  mode,
  onMainMenu,
}: {
  user: user | null;
  mode: string;
  onMainMenu: () => void;
}) => {
  return (
    <NavContainer>
      <Flex>
        {mode === "game" && (
          <Button style={{ marginRight: "auto" }} onClick={onMainMenu}>
            Главное меню
          </Button>
        )}
        {user ? (
          <>
            <h2>{user.name}</h2>
            <Button onClick={() => logout()}>Выйти</Button>
          </>
        ) : (
          <Button onClick={() => signIn()}>Войти через Google</Button>
        )}
      </Flex>
    </NavContainer>
  );
};
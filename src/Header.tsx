import { styled } from "@linaria/react";
import { Button } from "./Button";
import logo from "./img/logo.png";
import { useUser } from "./UserProvider";
import { Link, Outlet, useParams } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { css } from "@linaria/core";

const NavContainer = styled.nav`
  position: sticky;
  top: 0;
  background: white;
  box-shadow: 0 0 0.5rem hsl(0, 0%, 30%);
  z-index: 1;
`;
const Flex = styled.div`
  @media (min-width: 400) {
    padding: 1rem 2rem;
  }
  padding: 1rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
`;
const A = css`
  font-weight: bold;
  color: inherit;
  font-size: 1.125rem;
  text-decoration: none;
  transition: all 0.1s;
  &:hover {
    text-decoration: underline;
  }
`;
export const Header = ({}) => {
  const params = useParams();
  const user = useUser();
  return (
    <>
      <NavContainer>
        <Flex>
          <div></div>
          <img height="40px" src={logo} alt="" />
          {params?.imageID && (
            <Link className={A} to="/">
              Главное меню
            </Link>
          )}
          {user ? (
            <>
              <h2 style={{ marginLeft: "auto" }}>{user.name}</h2>
              <Button onClick={() => signOut(auth)}>Выйти</Button>
            </>
          ) : (
            <Button
              style={{ marginLeft: "auto" }}
              onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}
            >
              Войти через Google
            </Button>
          )}
        </Flex>
      </NavContainer>
      <Outlet />
    </>
  );
};

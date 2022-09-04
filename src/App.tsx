import { MainMenu } from "./MainMenu";
import { Header } from "./Header";
import { styled } from "@linaria/react";
import { Route, Routes } from "react-router-dom";
import { GameScreen } from "./GameScreen";

const AppContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
`;
const Footer = styled.footer`
  background: hsl(0, 0%, 10%);
  color: hsl(0, 0%, 90%);
  padding: 1rem 2rem;
`;
const A = styled.a`
  font-weight: bold;
  color: inherit;
  font-size: 1.125rem;
  text-decoration: none;
  transition: all 0.2s;
  &:hover {
    text-decoration: underline;
    color: hsl(210, 100%, 80%);
  }
`;
export const App = () => {
  return (
    <AppContainer>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route
            index
            element={
              <>
                <MainMenu />
                <Footer>
                  Изображения взяты из группы{" "}
                  <A href="https://vk.com/etoperepechko">Где Перепечко?</A>
                </Footer>
              </>
            }
          />
          <Route path=":imageID" element={<GameScreen />} />
        </Route>
      </Routes>
    </AppContainer>
  );
};

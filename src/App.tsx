import { Route, Routes } from "react-router-dom";
import { GameScreen } from "./pages/game/GameScreen";
import { RootLayout } from "./RootLayout";
import { MainMenu } from "./pages/main-page/MainMenu";

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<MainMenu />} />
        <Route path=":imageID" element={<GameScreen />} />
      </Route>
    </Routes>
  );
};

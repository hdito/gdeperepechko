import { Route, Routes } from "react-router-dom";
import { GameScreen } from "./pages/game/GameScreen";
import { RootLayout } from "./RootLayout";
import { MainMenu } from "./pages/main/MainMenu";

export type ImageIdParam = { imageId: string };

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<MainMenu />} />
        <Route path=":imageId" element={<GameScreen />} />
      </Route>
    </Routes>
  );
};

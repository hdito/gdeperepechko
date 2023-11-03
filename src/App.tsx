import { Route, Routes } from "react-router-dom";
import { GameScreen } from "./GameScreen";
import { Header } from "./Header";
import MainPage from "./MainPage";

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Header />}>
        <Route index element={<MainPage />} />
        <Route path=":imageID" element={<GameScreen />} />
      </Route>
    </Routes>
  );
};

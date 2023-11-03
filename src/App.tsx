import { Route, Routes } from "react-router-dom";
import { GameScreen } from "./GameScreen";
import { Header } from "./Header";
import MainPage from "./MainPage";

export const App = () => {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={<MainPage />} />
          <Route path=":imageID" element={<GameScreen />} />
        </Route>
      </Routes>
    </div>
  );
};

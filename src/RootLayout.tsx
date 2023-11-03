import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./components/Footer";

export const RootLayout = () => {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer>
        Изображения взяты из группы{" "}
        <a
          className="text-lg font-bold transition-all hover:text-sky-200 hover:underline"
          href="https://vk.com/etoperepechko"
        >
          Где Перепечко?
        </a>
      </Footer>
    </div>
  );
};

import { Footer } from "./Footer";
import { MainMenu } from "./MainMenu";

export default function MainPage() {
  return (
    <>
      <MainMenu />
      <Footer>
        Изображения взяты из группы{" "}
        <a
          className="text-lg font-bold transition-all hover:text-sky-200 hover:underline"
          href="https://vk.com/etoperepechko"
        >
          Где Перепечко?
        </a>
      </Footer>
    </>
  );
}

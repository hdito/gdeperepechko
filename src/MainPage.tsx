import { Footer } from "./Footer";
import { MainMenu } from "./MainMenu";
import { styled } from "@linaria/react";

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

export default function MainPage() {
  return (
    <>
      <MainMenu />
      <Footer>
        Изображения взяты из группы{" "}
        <A href="https://vk.com/etoperepechko">Где Перепечко?</A>
      </Footer>
    </>
  );
}
